import { formatPrice } from "../../../shared/utils/formatPrice";
import type { Property } from "../types";

export const PropertyCard = ({
  property,
  onClick,
}: {
  property: Property;
  onClick?: () => void;
}) => {
  const statusLabel = property.listingType === "SALE" ? "Venta" : "Renta";

  return (
    <div
      className="relative flex flex-col bg-white rounded-lg shadow p-3 overflow-hidden cursor-pointer transition hover:-translate-y-1 hover:shadow-lg"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          onClick?.();
        }
      }}
    >
      <div className="relative w-full mb-2">
        {property.images[0] ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-40 object-cover rounded-md transition duration-300"
            title={property.title}
          />
        ) : (
          <div className="w-full h-40 rounded-md bg-gray-200 flex items-center justify-center text-sm text-gray-500">
            Sin imagen
          </div>
        )}
        <span className="absolute bottom-2 right-2 bg-yellow-300 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow">
          {statusLabel}
        </span>
      </div>
      <p className="text-sm text-gray-700 mb-1">Código: #{property.id}</p>
      <span className="text-blue-600 font-bold text-2xl mb-2 block">
        {formatPrice(property.price, property.currency)}
      </span>
      <h4 className="text-base font-semibold text-gray-900 line-clamp-2 mb-3 min-h-[48px]">
        {property.title}
      </h4>
      <p className="text-base text-gray-700 flex items-center gap-2 mb-3">
        <span>📍</span>
        <span className="truncate">
          {property.location}
        </span>
      </p>
      <div className="flex items-center gap-4 text-sm text-gray-700 whitespace-nowrap">
        <span className="inline-flex items-center gap-1">🛏 {property.bedrooms}</span>
        <span className="inline-flex items-center gap-1">🛁 {property.bathrooms}</span>
        <span className="inline-flex items-center gap-1">📐 {property.area} m²</span>
      </div>
    </div>
  );
};
