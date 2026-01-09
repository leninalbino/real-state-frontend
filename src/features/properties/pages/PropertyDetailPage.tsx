import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ChevronLeft } from "lucide-react";
import "swiper/swiper-bundle.css";
import { formatPrice } from "../../../shared/utils/formatPrice";
import { getPropertyById } from "../services/propertyService";
import type { Property } from "../types";

const PropertyDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No se ha especificado un ID de propiedad.");
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedProperty = await getPropertyById(id);
        if (fetchedProperty) {
          setProperty(fetchedProperty);
        } else {
          setError("La propiedad no fue encontrada.");
        }
      } catch (err) {
        setError("Ocurrió un error al cargar la propiedad.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return <div className="text-center p-24">Cargando...</div>;
  }
  
  if (error || !property) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 px-4">
        <p className="text-xl font-semibold text-gray-800 mb-3">{error || "Propiedad no encontrada"}</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Volver
        </button>
      </div>
    );
  }

  const statusLabel = property.listingType === "SALE" ? "Venta" : "Renta";

  return (
    <div className="bg-white pt-16 pb-6 px-3 md:px-8 lg:px-12">
      <div className="w-full">
        <div className="flex items-center justify-between py-2 mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft size={28} />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            slidesPerView={1}
            breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            spaceBetween={12}
            className="w-full h-64 md:h-72 lg:h-96 rounded-xl overflow-hidden"
          >
            {property.images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <img src={img} alt={property.title} className="w-full h-64 md:h-72 lg:h-96 object-cover" />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2 flex flex-col gap-3">
              <p className="text-sm text-gray-700">Código: #{property.id}</p>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900">{property.title}</h1>
              <p className="text-lg text-gray-600 flex items-center gap-2">
                <span>📍</span>
                <span>{property.location}</span>
              </p>
              <div className="flex items-center gap-4 mt-1">
                <span className="inline-flex items-center bg-yellow-300 text-gray-900 text-sm font-semibold px-3 py-1 rounded-full">
                  {statusLabel}
                </span>
                <p className="text-blue-600 text-3xl font-black">{formatPrice(property.price, property.currency)}</p>
              </div>
              <div className="flex items-center gap-4 text-base text-gray-800 whitespace-nowrap">
                <span className="inline-flex items-center gap-2">🛏 {property.bedrooms}</span>
                <span className="inline-flex items-center gap-2">🛁 {property.bathrooms}</span>
                <span className="inline-flex items-center gap-2">📐 {property.area} m²</span>
              </div>
              <div className="mt-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Descripción</h2>
                <p className="text-gray-700">{property.description}</p>
              </div>
            </div>

            <div className="flex items-center md:items-start gap-4 bg-gray-50 rounded-2xl p-4 h-full shadow">
              {property.agent?.avatar ? (
                <img
                  src={property.agent.avatar}
                  alt={property.agent.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200" />
              )}
              <div className="text-gray-800 text-sm">
                <p className="font-semibold text-base">
                  {property.agent?.name || "Agente"}
                </p>
                <p className="text-gray-600">Agente inmobiliario</p>
                <div className="mt-3">
                  <p className="font-semibold">Celular:</p>
                  <p className="text-gray-700">{property.agent?.phone || "N/D"}</p>
                </div>
                <div className="mt-2">
                  <p className="font-semibold">Correo:</p>
                  <p className="text-gray-700">{property.agent?.email || "N/D"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
