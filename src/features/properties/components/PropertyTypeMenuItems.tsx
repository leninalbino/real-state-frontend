import type { PropertyType } from "../services/formService";

type PropertyTypeMenuItemsProps = {
  propertyTypes: PropertyType[];
  isSelected: (type: PropertyType) => boolean;
  onToggle: (type: PropertyType) => void;
};

export const PropertyTypeMenuItems = ({
  propertyTypes,
  isSelected,
  onToggle,
}: PropertyTypeMenuItemsProps) => (
  <div className="p-2 space-y-2">
    {propertyTypes.map((type) => (
      <button
        key={type.id}
        type="button"
        role="menuitemcheckbox"
        aria-checked={isSelected(type)}
        onClick={() => onToggle(type)}
        className={`flex items-center w-full px-4 py-2 text-sm rounded-md ${
          isSelected(type) ? "bg-yellow-300 text-black" : "text-gray-700"
        } hover:bg-yellow-100`}
      >
        <span>{type.name}</span>
      </button>
    ))}
  </div>
);
