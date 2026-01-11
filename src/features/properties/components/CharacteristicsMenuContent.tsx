import { useMemo, useState } from 'react';
import type { PropertyCharacteristic } from "../services/formService";
import type { SelectedAmenities } from "../hooks/useAmenitySelection";
import { MultiColumnPicker } from '../../../shared/ui/MultiColumnPicker';
import type { PickerNode } from '../../../shared/ui/MultiColumnPicker/types';

type CharacteristicsMenuContentProps = {
  characteristics: PropertyCharacteristic[];
  selectedAmenities: SelectedAmenities;
  onAmenityChange: (
    charId: string,
    value: string | { min?: string; max?: string }
  ) => void;
  activeCategory?: PropertyCharacteristic | null;
  onActiveCategoryChange?: (category: PropertyCharacteristic | null) => void;
  isAmenitySelected?: (charId: string, value: string) => boolean;
  showMoreCategories?: boolean;
  onToggleShowMore?: () => void;
};

interface CharacteristicMeta {
  characteristicId: string;
  value: string;
}

const transformCharacteristicsToPickerData = (characteristics: PropertyCharacteristic[]): PickerNode[] => {
  return characteristics
    .filter(char => char.type === 'select' || char.type === 'boolean')
    .map(char => {
      let children: PickerNode[] = [];
      if (char.type === 'boolean') {
        children = [
          { id: `${char.id}-true`, label: 'Sí', meta: { characteristicId: char.id, value: 'Sí' } },
          { id: `${char.id}-false`, label: 'No', meta: { characteristicId: char.id, value: 'No' } },
        ];
      } else if (char.type === 'select' && char.options) {
        children = char.options.map(opt => ({
          id: `${char.id}-${opt.value}`,
          label: opt.label,
          meta: { characteristicId: char.id, value: opt.value },
        }));
      }
      return {
        id: char.id,
        label: char.label,
        children: children,
      };
    });
};

const getSelectedValues = (amenities: SelectedAmenities, data: PickerNode[]): string[] => {
    const selectedIds: string[] = [];
    for (const charId in amenities) {
        const value = amenities[charId];
        const rootNode = data.find(d => d.id === charId);
        if (rootNode && rootNode.children) {
            const childNode = rootNode.children.find(c => (c.meta as CharacteristicMeta).value === value);
            if (childNode) {
                selectedIds.push(rootNode.id, childNode.id);
            }
        }
    }
    return selectedIds;
}


export const CharacteristicsMenuContent = ({
  characteristics,
  selectedAmenities,
  onAmenityChange,
}: CharacteristicsMenuContentProps) => {
  const pickerData = useMemo(() => transformCharacteristicsToPickerData(characteristics), [characteristics]);
  
  // This state is now local to the picker and its wrapper
  const [valueIds, setValueIds] = useState<string[]>(getSelectedValues(selectedAmenities, pickerData));

  const handleChange = (path: PickerNode[], ids: string[]) => {
    if (path.length === 2) { // We expect a 2-level selection: Characteristic -> Value
      const leafNode = path[1];
      const { characteristicId, value } = leafNode.meta as CharacteristicMeta;
      onAmenityChange(characteristicId, value);
      setValueIds(ids);
    } else if (path.length === 0) {
        // Handle deselection if necessary, though current picker doesn't support it
    }
  };
  
  const renderDisplayValue = (nodes: PickerNode[]): string => {
    if (nodes.length === 0) return '';
    // We only care about the final selected value for display
    if (nodes.length > 0) {
        const lastNode = nodes[nodes.length - 1];
        const parentNode = nodes[nodes.length - 2];
        if (lastNode && parentNode) {
            return `${parentNode.label}: ${lastNode.label}`;
        }
    }
    return nodes.map(n => n.label).join(' / ');
  }

  return (
    <div className="p-4 bg-[#eef9fd]">
        <MultiColumnPicker
            label="Seleccionar Característica"
            placeholder="Elige una o más características"
            data={pickerData}
            valueIds={valueIds}
            onChange={handleChange}
            renderValue={renderDisplayValue}
            closeOnLeafSelect={true}
        />
        {/* TODO: Handle number_range inputs here if needed */}
    </div>
  );
};
