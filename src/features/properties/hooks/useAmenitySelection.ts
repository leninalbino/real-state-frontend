import { useState } from "react";

export type SelectedAmenities = Record<
  string,
  string[] | { min?: string; max?: string }
>;

type SelectionMode = "single" | "multi";

export const useAmenitySelection = (mode: SelectionMode = "multi") => {
  const [selectedAmenities, setSelectedAmenities] = useState<SelectedAmenities>(
    {}
  );

  const handleAmenityChange = (
    charId: string,
    value: string | { min?: string; max?: string }
  ) => {
    setSelectedAmenities((prev) => {
      const currentValues = prev[charId];
      let newValues;

      if (typeof value === "string") {
        if (mode === "single") {
          newValues = [value];
        } else if (Array.isArray(currentValues)) {
          newValues = currentValues.includes(value)
            ? currentValues.filter((v) => v !== value)
            : [...currentValues, value];
        } else {
          newValues = [value];
        }
      } else {
        newValues = {
          ...((currentValues as { min?: string; max?: string }) || {}),
          ...value,
        };
      }

      return { ...prev, [charId]: newValues };
    });
  };

  const isAmenitySelected = (charId: string, value: string): boolean => {
    const selected = selectedAmenities[charId];
    if (Array.isArray(selected)) {
      return selected.includes(value);
    }
    return false;
  };

  return {
    selectedAmenities,
    setSelectedAmenities,
    handleAmenityChange,
    isAmenitySelected,
  };
};
