import { Menu, Transition } from "@headlessui/react";
import { Megaphone, Search, MapPin } from "lucide-react";
import { Fragment, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ListingType } from "../types";
import { formatPrice } from "../../../shared/utils/formatPrice";
import { PropertyTypeMenuItems } from "./PropertyTypeMenuItems";
import type { SelectedAmenities } from "../hooks/useAmenitySelection";
import { usePropertyFiltersData } from "../hooks/usePropertyFiltersData";
import type { PropertyType, PropertyCharacteristic } from "../services/formService";
import { VentaIcon, RentaIcon, TipoIcon, PriceIcon, CaracteristicasIcon } from "../../../shared/iconsvg";

import { CascadingPanelPicker } from "../../../shared/ui/CascadingPanelPicker";
import type { PickerNode } from "../../../shared/ui/MultiColumnPicker/types";
import { useLocationData } from "../hooks/useLocationData";

interface CharacteristicMeta {
  characteristicId: string;
  value: string;
}

interface SearchBarProps {
  tiposSeleccionados: ListingType[];
  setTiposSeleccionados: React.Dispatch<React.SetStateAction<ListingType[]>>;
  selectedPropTypes: PropertyType[];
  setSelectedPropTypes: React.Dispatch<React.SetStateAction<PropertyType[]>>;
  priceRange: { min: number; max: number };
  setPriceRange: React.Dispatch<React.SetStateAction<{ min: number; max: number }>>;
  setSelectedLocation: React.Dispatch<React.SetStateAction<string>>;
  selectedAmenities: SelectedAmenities;
  onAmenityChange: (
    charId: string,
    value: string | { min?: string; max?: string }
  ) => void;
}

export const SearchBar = ({
  tiposSeleccionados,
  setTiposSeleccionados,
  selectedPropTypes,
  setSelectedPropTypes,
  priceRange,
  setPriceRange,
  setSelectedLocation,
  selectedAmenities,
  onAmenityChange,
}: SearchBarProps) => {
  const navigate = useNavigate();
  const [draggingInput, setDraggingInput] = useState<'min' | 'max' | null>(null);
  const priceMin = 0;
  const priceMax = 500000;
  const priceStep = 10000;
  const [currency, setCurrency] = useState<'USD' | 'RD'>('USD');
  const { propertyTypes, characteristics, loading, error } =
    usePropertyFiltersData();
  const { locationData } = useLocationData();
  const [locationValueIds, setLocationValueIds] = useState<string[]>([]);

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
          children = char.options.map((opt) => ({
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
          selectedIds.push(childNode.id);
        }
      }
    }
    return selectedIds;
  };

  const pickerData = useMemo(() => transformCharacteristicsToPickerData(characteristics), [characteristics]);
  const selectedIds = useMemo(() => getSelectedValues(selectedAmenities, pickerData), [selectedAmenities, pickerData]);
  const [previousSelected, setPreviousSelected] = useState<string[]>(selectedIds);

  // Update previousSelected when selectedIds changes
  useEffect(() => {
    setPreviousSelected(selectedIds);
  }, [selectedIds]);

  const handleCharacteristicsChange = (selectedLeafIds: string[], selectedLeafNodes: PickerNode[]) => {
    const added = selectedLeafIds.filter(id => !previousSelected.includes(id));
    const removed = previousSelected.filter(id => !selectedLeafIds.includes(id));

    for (const id of added) {
      const node = selectedLeafNodes.find(n => n.id === id);
      if (node) {
        const { characteristicId, value } = (node.meta as CharacteristicMeta);
        onAmenityChange(characteristicId, value);
      }
    }
    for (const id of removed) {
      const node = pickerData.flatMap(d => d.children || []).find(c => c.id === id);
      if (node) {
        const { characteristicId, value } = (node.meta as CharacteristicMeta);
        onAmenityChange(characteristicId, value); // toggle off
      }
    }
    setPreviousSelected(selectedLeafIds);
  };

  const handleToggle = (tipo: ListingType) => {
    if (tiposSeleccionados.includes(tipo)) {
      if (tiposSeleccionados.length > 1) {
        setTiposSeleccionados(tiposSeleccionados.filter(t => t !== tipo));
      }
    } else {
      setTiposSeleccionados([...tiposSeleccionados, tipo]);
    }
  };

  const handlePropTypeToggle = (propType: PropertyType) => {
    setSelectedPropTypes(prev =>
      prev.some(p => p.id === propType.id)
        ? prev.filter(p => p.id !== propType.id)
        : [...prev, propType]
    );
  };

  const isPriceFilterActive = priceRange.min > priceMin || priceRange.max < priceMax;
  const isCharacteristicsFilterActive = Object.keys(selectedAmenities).length > 0;

  // Botones de filtro principales
  const filterButtons = [
    {
      key: 'SALE',
      label: 'Ventas',
      icon: <VentaIcon active={tiposSeleccionados.includes('SALE')} size={24} />,
      active: tiposSeleccionados.includes('SALE'),
      onClick: () => handleToggle('SALE'),
    },
    {
      key: 'RENT',
      label: 'Rentas',
      icon: <RentaIcon active={tiposSeleccionados.includes('RENT')} size={24} />,
      active: tiposSeleccionados.includes('RENT'),
      onClick: () => handleToggle('RENT'),
    },
    {
      key: 'busca',
      label: 'Busca',
      icon: <Search size={24} className="mb-1 text-yellow-500" />,
      active: true, // Siempre activo visualmente
      onClick: undefined,
    },
    {
      key: 'anuncia',
      label: 'Anuncia',
      icon: <Megaphone size={24} className="mb-1 text-indigo-400" />,
      active: false,
      onClick: () => navigate("/anunciar"),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      icon: <TipoIcon active={selectedPropTypes.length > 0} size={24} />,
      active: selectedPropTypes.length > 0,
      onClick: undefined, // Abre menú
    },
    {
      key: 'precio',
      label: 'Precio',
      icon: <PriceIcon active={isPriceFilterActive} size={24} />,
      active: isPriceFilterActive,
      onClick: undefined, // Abre menú
    },
    {
      key: 'caracteristicas',
      label: 'Características',
      icon: <CaracteristicasIcon active={isCharacteristicsFilterActive} size={24} />,
      active: isCharacteristicsFilterActive,
      onClick: undefined, // Abre menú
    },
  ];

  if (loading) {
    return (
      <div className="w-full p-0 bg-transparent rounded-none border-0 shadow-none mt-8 text-center">
        <p className="text-gray-600">Cargando filtros...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-0 bg-transparent rounded-none border-0 shadow-none mt-8 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full p-0 bg-transparent rounded-none border-0 shadow-none mt-8">
        {/* Barra de filtros horizontal */}
        <div className="flex items-center justify-between gap-3 overflow-visible py-2 px-1 w-full">
          {filterButtons.map((btn) => {
            // Menús para tipo, precio, características
            if (btn.key === 'tipo') {
              return (
                <Menu as="div" className="relative flex flex-col items-center flex-1 min-w-0" key={btn.key}>
                  <span className="flex items-center justify-center mb-1">{btn.icon}</span>
                  <Menu.Button className={`w-full px-2 py-2 rounded-2xl border transition-all font-bold text-base ${btn.active ? 'bg-yellow-300 text-black border-yellow-300' : 'bg-white border-gray-300 text-gray-700'} hover:shadow-md focus:outline-none`}>
                    {btn.label}
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute top-full mt-2 w-56 origin-top-left bg-[#eef9fd] divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <PropertyTypeMenuItems
                        propertyTypes={propertyTypes}
                        isSelected={(type) =>
                          selectedPropTypes.some((p) => p.id === type.id)
                        }
                        onToggle={handlePropTypeToggle}
                      />
                    </Menu.Items>
                  </Transition>
                </Menu>
              );
            }
            if (btn.key === 'precio') {
              return (
                <Menu as="div" className="relative flex flex-col items-center flex-1 min-w-0" key={btn.key}>
                  <span className="flex items-center justify-center mb-1">{btn.icon}</span>
                  <Menu.Button className={`w-full px-2 py-2 rounded-2xl border transition-all font-bold text-base ${btn.active ? 'bg-yellow-300 text-black border-yellow-300' : 'bg-white border-gray-300 text-gray-700'} hover:shadow-md focus:outline-none`}>
                    {btn.label}
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute top-full mt-2 w-96 origin-top-left bg-[#eef9fd] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <div className="p-4 space-y-6">
                        {/* Selector de Moneda */}
                        <div>
                          <label className="text-sm font-semibold text-gray-800 mb-2 block">Moneda</label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setCurrency('USD')}
                              className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all ${
                                currency === 'USD'
                                  ? 'bg-yellow-300 text-black'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              USD
                            </button>
                            <button
                              type="button"
                              onClick={() => setCurrency('RD')}
                              className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all ${
                                currency === 'RD'
                                  ? 'bg-yellow-300 text-black'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              RD$
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="text-sm font-semibold text-gray-800">Rango de Precios</div>

                          {/* Barra de Rango Dual */}
                          <div className="space-y-3">
                            {/* Labels de Min y Max */}
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-gray-700">{formatPrice(priceRange.min, currency)}</span>
                              <span className="text-sm font-bold text-gray-700">{formatPrice(priceRange.max, currency)}</span>
                            </div>

                            {/* Range Slider Container */}
                            <div className="relative h-8 flex items-center">
                              {/* Barra de fondo gris */}
                              <div className="absolute w-full h-2 bg-gray-300 rounded-full pointer-events-none z-0"></div>

                              {/* Barra azul del rango seleccionado */}
                              <div
                                className="absolute h-2 bg-blue-500 rounded-full pointer-events-none z-0"
                                style={{
                                  left: `${(priceRange.min / priceMax) * 100}%`,
                                  right: `${100 - (priceRange.max / priceMax) * 100}%`,
                                }}
                              ></div>

                              {/* Input Máximo */}
                              <input
                                type="range"
                                min={priceMin}
                                max={priceMax}
                                step={priceStep}
                                value={priceRange.max}
                                onChange={(e) => {
                                  const newMax = parseInt(e.target.value, 10);
                                  if (newMax >= priceRange.min) {
                                    setPriceRange(prev => ({ ...prev, max: newMax }));
                                  }
                                }}
                                onMouseDown={() => setDraggingInput('max')}
                                onMouseUp={() => setDraggingInput(null)}
                                onTouchStart={() => setDraggingInput('max')}
                                onTouchEnd={() => setDraggingInput(null)}
                                className="absolute w-full h-2 bg-transparent rounded-full appearance-none cursor-pointer range-input range-input--dual range-thumb-blue"
                                style={{
                                  WebkitAppearance: 'none',
                                  zIndex: draggingInput === 'min' ? 20 : 30,
                                }}
                              />

                              {/* Input Mínimo */}
                              <input
                                type="range"
                                min={priceMin}
                                max={priceMax}
                                step={priceStep}
                                value={priceRange.min}
                                onChange={(e) => {
                                  const newMin = parseInt(e.target.value, 10);
                                  if (newMin <= priceRange.max) {
                                    setPriceRange(prev => ({ ...prev, min: newMin }));
                                  }
                                }}
                                onMouseDown={() => setDraggingInput('min')}
                                onMouseUp={() => setDraggingInput(null)}
                                onTouchStart={() => setDraggingInput('min')}
                                onTouchEnd={() => setDraggingInput(null)}
                                className="absolute w-full h-2 bg-transparent rounded-full appearance-none cursor-pointer range-input range-input--dual range-thumb-blue"
                                style={{
                                  WebkitAppearance: 'none',
                                  zIndex: draggingInput === 'min' ? 30 : 20,
                                }}
                              />
                            </div>

                            {/* Resumen */}
                            <div className="text-center text-gray-700 font-semibold pt-2 border-t border-gray-200">
                              {formatPrice(priceRange.min, currency)} - {formatPrice(priceRange.max, currency)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              );
            }
            if (btn.key === 'caracteristicas') {
              return (
                <div className="relative flex flex-col items-center flex-1 min-w-0" key={btn.key}>
                  <span className="flex items-center justify-center mb-1">{btn.icon}</span>
                  <CascadingPanelPicker
                    trigger={
                      <button className={`w-full px-2 py-2 rounded-2xl border transition-all font-bold text-base ${btn.active ? 'bg-yellow-300 text-black border-yellow-300' : 'bg-white border-gray-300 text-gray-700'} hover:shadow-md focus:outline-none`}>
                        {btn.label}
                      </button>
                    }
                    data={pickerData}
                    selectionMode="multiple"
                    value={selectedIds}
                    onChange={handleCharacteristicsChange}
                  />
                </div>
              );
            }
            // Botón normal
            return (
              <div key={btn.key} className="flex flex-col items-center flex-1 min-w-0">
                <span className="flex items-center justify-center mb-1">{btn.icon}</span>
                <button
                  onClick={btn.onClick}
                  className={`w-full px-2 py-2 rounded-2xl border transition-all font-bold text-base ${btn.active ? 'bg-yellow-300 border-yellow-400 text-black shadow' : 'bg-white border-gray-300 text-gray-700'} hover:shadow-md focus:outline-none`}
                  disabled={!btn.onClick}
                >
                  {btn.label}
                </button>
              </div>
            );
          })}
        </div>
        {/* Input de búsqueda */}
        <CascadingPanelPicker
            trigger={
                <div className="relative mt-4 mb-2">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <MapPin size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Lugar donde deseas buscar"
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={locationValueIds.length > 0 ? locationData.find(n => locationValueIds.includes(n.id))?.label || '' : ''}
                        readOnly
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center">
                        <Search size={26} className="text-blue-500" />
                    </div>
                </div>
            }
            data={locationData}
            selectionMode="single"
            value={locationValueIds}
            onChange={(ids, nodes) => {
                setLocationValueIds(ids);
                // Use the label of the last selected node for the search query
                const lastNode = nodes[nodes.length - 1];
                if (lastNode) {
                    setSelectedLocation(lastNode.label);
                } else {
                    setSelectedLocation('');
                }
            }}
        />
      </div>
    </>
  );
};
