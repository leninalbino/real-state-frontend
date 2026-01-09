import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PropertyCard } from "./PropertyCard";
import { getProperties } from "../services/propertyService";
import type { Property, ListingType } from "../types";
import type { PropertyType } from "../services/formService";
import type { SelectedAmenities } from "../hooks/useAmenitySelection";

type ContentSearchProps = {
  tipos: ListingType[];
  selectedPropTypes: PropertyType[];
  priceRange: { min: number; max: number };
  locationQuery: string;
  selectedAmenities: SelectedAmenities;
};

export const ContentSearch = ({
  tipos,
  selectedPropTypes,
  priceRange,
  locationQuery,
  selectedAmenities,
}: ContentSearchProps) => {
  const navigate = useNavigate();
  const [ventas, setVentas] = useState<Property[]>([]);
  const [rentas, setRentas] = useState<Property[]>([]);
  const [ventasMeta, setVentasMeta] = useState({
    page: 1,
    pageSize: 15,
    total: 0,
    totalPages: 1,
  });
  const [rentasMeta, setRentasMeta] = useState({
    page: 1,
    pageSize: 15,
    total: 0,
    totalPages: 1,
  });
  const [pageVentas, setPageVentas] = useState(1);
  const [pageRentas, setPageRentas] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPageVentas(1);
    setPageRentas(1);
  }, [tipos, selectedPropTypes, priceRange, locationQuery, selectedAmenities]);

  useEffect(() => {
    const debounceMs = 400;
    const handler = window.setTimeout(() => {
      const fetchProperties = async () => {
        setLoading(true);
        setError(null);
        try {
          const bedroomsValue = selectedAmenities['bedrooms'];
          const bathroomsValue = selectedAmenities['bathrooms'];
          const areaValue = selectedAmenities['area_m2'];

          const bedrooms = Array.isArray(bedroomsValue)
            ? Number(String(bedroomsValue[0]).replace('+', ''))
            : undefined;
          const bathrooms = Array.isArray(bathroomsValue)
            ? Number(String(bathroomsValue[0]).replace('+', ''))
            : undefined;
          const areaMin =
            areaValue && !Array.isArray(areaValue) && areaValue.min
              ? Number(areaValue.min)
              : undefined;
          const areaMax =
            areaValue && !Array.isArray(areaValue) && areaValue.max
              ? Number(areaValue.max)
              : undefined;

          const amenities = Object.entries(selectedAmenities).flatMap(
            ([key, value]) => {
              if (key === 'bedrooms' || key === 'bathrooms' || key === 'area_m2') {
                return [];
              }
              if (Array.isArray(value)) {
                return value.map((entry) => `${key}:${entry}`);
              }
              if (value && (value.min || value.max)) {
                return [`${key}:${value.min || ''}-${value.max || ''}`];
              }
              return [];
            }
          );

          const baseFilters = {
            type: selectedPropTypes.map((type) => type.id),
            minPrice: priceRange.min,
            maxPrice: priceRange.max,
            location: locationQuery,
            bedrooms: Number.isFinite(bedrooms) ? bedrooms : undefined,
            bathrooms: Number.isFinite(bathrooms) ? bathrooms : undefined,
            areaMin,
            areaMax,
            amenities,
            pageSize: 15,
          };

          const requests: Promise<Awaited<ReturnType<typeof getProperties>>>[] = [];
          const order: Array<'SALE' | 'RENT'> = [];
          const wantsSales = tipos.includes("SALE");
          const wantsRent = tipos.includes("RENT");

          if (wantsSales) {
            requests.push(
              getProperties({
                ...baseFilters,
                listingType: ["SALE"],
                page: pageVentas,
              })
            );
            order.push('SALE');
          } else {
            setVentas([]);
            setVentasMeta((prev) => ({ ...prev, total: 0, totalPages: 1 }));
          }

          if (wantsRent) {
            requests.push(
              getProperties({
                ...baseFilters,
                listingType: ["RENT"],
                page: pageRentas,
              })
            );
            order.push('RENT');
          } else {
            setRentas([]);
            setRentasMeta((prev) => ({ ...prev, total: 0, totalPages: 1 }));
          }

          const results = await Promise.all(requests);
          results.forEach((result, index) => {
            const key = order[index];
            if (key === 'SALE') {
              setVentas(result.data);
              setVentasMeta({
                page: result.page,
                pageSize: result.pageSize,
                total: result.total,
                totalPages: result.totalPages,
              });
            }
            if (key === 'RENT') {
              setRentas(result.data);
              setRentasMeta({
                page: result.page,
                pageSize: result.pageSize,
                total: result.total,
                totalPages: result.totalPages,
              });
            }
          });
        } catch (err) {
          setError("No se pudieron cargar las propiedades.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchProperties();
    }, debounceMs);

    return () => window.clearTimeout(handler);
  }, [
    tipos,
    selectedPropTypes,
    priceRange,
    locationQuery,
    selectedAmenities,
    pageVentas,
    pageRentas,
  ]);

  if (error && ventas.length === 0 && rentas.length === 0) {
    return <div className="text-center p-12 text-red-500">{error}</div>;
  }

  const showVentas = tipos.includes("SALE") && ventas.length > 0;
  const showRentas = tipos.includes("RENT") && rentas.length > 0;

  if (!loading && !showVentas && !showRentas) {
    return (
      <div className="bg-white p-8 font-sans">
        <div className="w-full flex flex-col items-center justify-center py-16 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
            <Search size={28} className="text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            No encontramos resultados
          </h3>
          <p className="mt-2 text-gray-600">
            Ajusta los filtros o prueba otra zona.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 font-sans">
      <div className="w-full">
        {loading && (
          <div className="mb-6 flex items-center justify-center text-sm text-gray-500">
            Actualizando resultados...
          </div>
        )}
        {error && (ventas.length > 0 || rentas.length > 0) && (
          <div className="mb-6 text-center text-sm text-red-500">
            {error}
          </div>
        )}
        {showVentas && (
          <div className="mb-12">
            <h2 className="inline-flex text-3xl font-bold mb-8 text-gray-900 bg-[#fdf542] px-4">
              Ventas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4">
              {ventas.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onClick={() => navigate(`/propiedad/${property.id}`)}
                />
              ))}
            </div>
            {ventasMeta.totalPages > 1 && (
              <Pagination
                currentPage={pageVentas}
                totalPages={ventasMeta.totalPages}
                onPageChange={setPageVentas}
              />
            )}
          </div>
        )}
        {showRentas && (
          <div className="mb-12">
            <h2 className="inline-flex text-3xl font-bold mb-8 text-gray-900 bg-[#fdf542] px-4">
              Rentas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4">
              {rentas.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onClick={() => navigate(`/propiedad/${property.id}`)}
                />
              ))}
            </div>
            {rentasMeta.totalPages > 1 && (
              <Pagination
                currentPage={pageRentas}
                totalPages={rentasMeta.totalPages}
                onPageChange={setPageRentas}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const pages: Array<number | "ellipsis"> = [];
  const range = [
    1,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    totalPages,
  ].filter((page) => page >= 1 && page <= totalPages);
  const unique = Array.from(new Set(range)).sort((a, b) => a - b);

  unique.forEach((page, index) => {
    pages.push(page);
    const next = unique[index + 1];
    if (next && next - page > 1) {
      pages.push("ellipsis");
    }
  });

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-md text-sm font-semibold border ${
          currentPage === 1
            ? "text-gray-400 border-gray-200 cursor-not-allowed"
            : "text-gray-700 border-gray-300 hover:bg-gray-100"
        }`}
      >
        Anterior
      </button>
      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-md text-sm font-semibold border ${
              page === currentPage
                ? "bg-yellow-300 border-yellow-300 text-gray-900"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-md text-sm font-semibold border ${
          currentPage === totalPages
            ? "text-gray-400 border-gray-200 cursor-not-allowed"
            : "text-gray-700 border-gray-300 hover:bg-gray-100"
        }`}
      >
        Siguiente
      </button>
    </div>
  );
};
