import type { PropertyCharacteristic } from "../services/formService";
import type { SelectedAmenities } from "../hooks/useAmenitySelection";

type CharacteristicsMenuContentProps = {
  characteristics: PropertyCharacteristic[];
  activeCategory: PropertyCharacteristic | null;
  onActiveCategoryChange: (category: PropertyCharacteristic | null) => void;
  selectedAmenities: SelectedAmenities;
  onAmenityChange: (
    charId: string,
    value: string | { min?: string; max?: string }
  ) => void;
  isAmenitySelected: (charId: string, value: string) => boolean;
  showMoreCategories: boolean;
  onToggleShowMore: () => void;
};

export const CharacteristicsMenuContent = ({
  characteristics,
  activeCategory,
  onActiveCategoryChange,
  selectedAmenities,
  onAmenityChange,
  isAmenitySelected,
  showMoreCategories,
  onToggleShowMore,
}: CharacteristicsMenuContentProps) => {
  const visibleCharacteristics = showMoreCategories
    ? characteristics
    : characteristics.slice(0, 6);

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-[500px]">
      <div className="w-full md:w-48 border-r border-gray-200 p-0 border-b md:border-b-0 flex flex-col relative">
        <div className="p-2 space-y-2 overflow-y-auto flex-1 pb-16">
          {visibleCharacteristics.map((char) => (
            <button
              key={char.id}
              onClick={() =>
                onActiveCategoryChange(
                  activeCategory?.id === char.id ? null : char
                )
              }
              className={`w-full text-left px-4 py-3 rounded-md font-semibold text-sm transition-colors ${
                activeCategory?.id === char.id
                  ? "bg-yellow-300 text-black"
                  : "text-gray-700 hover:bg-yellow-100"
              }`}
            >
              {char.label}
            </button>
          ))}
        </div>

        {characteristics.length > 6 && (
          <button
            onClick={onToggleShowMore}
            className="absolute bottom-0 left-0 right-0 py-3 bg-white border-t border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <span className="text-xl font-bold text-gray-700">
              {showMoreCategories ? "-" : "+"}
            </span>
          </button>
        )}
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {activeCategory ? (
          <div>
            <div className="text-sm font-semibold text-gray-800 mb-3">
              {activeCategory.type === "number_range"
                ? `Rango de ${activeCategory.label.toLowerCase()}`
                : `Selecciona opcion para ${activeCategory.label.toLowerCase()}`}
            </div>

            {activeCategory.type === "boolean" && (
              <div className="space-y-2">
                {["Sí", "No"].map((option) => (
                  <button
                    key={option}
                    onClick={() => onAmenityChange(activeCategory.id, option)}
                    className={`w-full text-left px-4 py-2 rounded-md text-sm transition-colors ${
                      isAmenitySelected(activeCategory.id, option)
                        ? "bg-yellow-300 text-black"
                        : "text-gray-700 hover:bg-yellow-100"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {activeCategory.type === "select" && activeCategory.options && (
              <div className="space-y-2">
                {activeCategory.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      onAmenityChange(activeCategory.id, option.value)
                    }
                    className={`w-full text-left px-4 py-2 rounded-md text-sm transition-colors ${
                      isAmenitySelected(activeCategory.id, option.value)
                        ? "bg-yellow-300 text-black"
                        : "text-gray-700 hover:bg-yellow-100"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}

            {activeCategory.type === "number_range" && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">
                    Mínimo
                  </label>
                  <input
                    type="number"
                    placeholder="Ej: 100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    onChange={(e) =>
                      onAmenityChange(activeCategory.id, {
                        ...(selectedAmenities[activeCategory.id] as {
                          min?: string;
                          max?: string;
                        }),
                        min: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">
                    Máximo
                  </label>
                  <input
                    type="number"
                    placeholder="Ej: 500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    onChange={(e) =>
                      onAmenityChange(activeCategory.id, {
                        ...(selectedAmenities[activeCategory.id] as {
                          min?: string;
                          max?: string;
                        }),
                        max: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            <p className="text-sm">Selecciona una categoría</p>
          </div>
        )}
      </div>
    </div>
  );
};
