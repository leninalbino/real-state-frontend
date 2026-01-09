import { useEffect, useState, Fragment } from "react";
import { Upload, Home, KeyRound, MousePointerClick, DollarSign, Box, MapPin, ChevronLeft, X } from "lucide-react";
import { Menu, Transition } from "@headlessui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../app/auth/useAuth";
import { DOMINICAN_REPUBLIC_LOCATIONS, type Provincia } from "../../../shared/data/locations";
import { formatPrice } from "../../../shared/utils/formatPrice";
import { CharacteristicsMenuContent } from "./CharacteristicsMenuContent";
import { PropertyTypeMenuItems } from "./PropertyTypeMenuItems";
import { useAmenitySelection, type SelectedAmenities } from "../hooks/useAmenitySelection";
import { usePropertyFiltersData } from "../hooks/usePropertyFiltersData";
import type { PropertyType, PropertyCharacteristic } from "../services/formService";
import type { Property, ListingType } from "../types"; // Import Currency

type PropertyFormData = Omit<Property, 'id' | 'moderationStatus' | 'agent'>;

interface AdFormProps {
  onCancel?: () => void;
  initialData?: Property | null;
  isEditing?: boolean;
  onSubmit: (data: PropertyFormData) => Promise<void>;
}

export const AdForm = ({ onCancel, initialData, isEditing = false, onSubmit }: AdFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const priceMin = 0;
  const priceMax = 500000;
  const priceStep = 10000;

  // Estado del formulario
  const [enviado, setEnviado] = useState(false);
  const [tiposSeleccionados, setTiposSeleccionados] = useState<ListingType[]>([
    "SALE",
  ]);
  const [selectedPropType, setSelectedPropType] = useState<PropertyType | null>(null);
  const [activeProvince, setActiveProvince] = useState<Provincia | null>(null);
  const [finalLocation, setFinalLocation] = useState<string>("");
  const [priceValue, setPriceValue] = useState<number>(priceMin);
  const [currency, setCurrency] = useState<'USD' | 'RD'>('USD');
  const [activeCategory, setActiveCategory] = useState<PropertyCharacteristic | null>(null);
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [titulo, setTitulo] = useState("");
  const [uploadedPhotos, setUploadedPhotos] = useState<(File | string)[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const DRAFT_KEY = "adFormDraft";
  const [draftReady, setDraftReady] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<{
    selectedPropTypeId?: string;
  } | null>(null);

  const {
    selectedAmenities,
    setSelectedAmenities,
    handleAmenityChange,
    isAmenitySelected,
  } = useAmenitySelection("single");
  const { propertyTypes, characteristics, loading, error } =
    usePropertyFiltersData();

  useEffect(() => {
    if (isEditing && initialData) {
      // Populate basic fields
      setTitulo(initialData.title);
      setDescripcion(initialData.description);
      setPriceValue(initialData.price);
      setCurrency(initialData.currency as 'USD' | 'RD');
      setFinalLocation(initialData.location);
      setTiposSeleccionados([initialData.listingType]);
      if (initialData.images) {
        setPhotoPreviews(initialData.images);
        setUploadedPhotos(initialData.images);
      }
      
      // Parse amenities from the string array into the state object
      if (initialData.amenities) {
        const amenitiesState: SelectedAmenities = {};
        initialData.amenities.forEach(amenity => {
          const [key, value] = amenity.split(':');
          if (key && value !== undefined) {
            if (value.includes('-')) {
              const [min, max] = value.split('-');
              amenitiesState[key] = { min: min || undefined, max: max || undefined };
            } else {
              // For single or multi-select, the value is an array
              if (amenitiesState[key] && Array.isArray(amenitiesState[key])) {
                 (amenitiesState[key] as string[]).push(value);
              } else {
                 amenitiesState[key] = [value];
              }
            }
          }
        });
        setSelectedAmenities(amenitiesState);
      }
    }
  }, [initialData, isEditing]);

  // Effect to set property type once types are loaded
  useEffect(() => {
    if (isEditing && initialData && initialData.type && propertyTypes.length > 0) {
      const propType = propertyTypes.find(pt => pt.id === initialData.type);
      if (propType) {
        setSelectedPropType(propType);
      }
    }
  }, [initialData, isEditing, propertyTypes]);


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
    setSelectedPropType(selectedPropType?.id === propType.id ? null : propType);
  };

  const handlePriceSliderChange = (value: number) => {
    setPriceValue(value);
  };

  const handlePriceInputChange = (value: string) => {
    if (!/^\d*$/.test(value)) return;
    const numeric = value === "" ? priceMin : Math.min(parseInt(value, 10), priceMax);
    setPriceValue(numeric);
  };

  const extractNumber = (
    value?: string[] | { min?: string; max?: string }
  ) => {
    if (!value || !Array.isArray(value)) return 0;
    const numeric = Number(String(value[0]).replace('+', ''));
    return Number.isNaN(numeric) ? 0 : numeric;
  };


  const getAreaValue = () => {
    const areaValue = selectedAmenities['area_m2'];
    if (areaValue && !Array.isArray(areaValue)) {
      const max = areaValue.max ? Number(areaValue.max) : 0;
      const min = areaValue.min ? Number(areaValue.min) : 0;
      return max || min || 0;
    }
    return 0;
  };

  const isFormValid =
    tiposSeleccionados.length > 0 &&
    selectedPropType !== null &&
    finalLocation.length > 0 &&
    photoPreviews.length > 0 &&
    titulo.trim().length > 0 &&
    descripcion.trim().length > 0;

  const handleAceptar = async () => {
    if (!isEditing && !isAuthenticated) {
      saveDraft();
      navigate("/acceso", { state: { from: location } });
      return;
    }

    if (!isEditing && user?.role === "buyer") {
      setSubmitError("No tienes permisos para publicar anuncios.");
      return;
    }

    if (!isFormValid) return;

    setSubmitError("");
    setIsSubmitting(true);
    try {
      const listingType = tiposSeleccionados[0];
      const bedrooms = extractNumber(selectedAmenities['bedrooms']);
      const bathrooms = extractNumber(selectedAmenities['bathrooms']);
// ...
      const area = getAreaValue();
      const amenities = Object.entries(selectedAmenities).map(([key, value]) => {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          const min = value.min || '';
          const max = value.max || '';
          return `${key}:${min}-${max}`;
        }
        if (Array.isArray(value)) {
          return `${key}:${value.join(',')}`;
        }
        return `${key}:${value}`;
      });

      const propertyData = {
        title: titulo,
        price: priceValue,
        currency,
        location: finalLocation,
        bedrooms,
        bathrooms,
        area,
        type: selectedPropType?.id || "sin-tipo",
        listingType,
        description: descripcion,
        images: photoPreviews.filter(Boolean) as string[],
        amenities,
      };

      await onSubmit(propertyData);

      setEnviado(true);
      if (!isEditing) {
        clearDraft();
      }
      setTimeout(() => {
        setEnviado(false);
        onCancel?.();
      }, 3500);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al procesar la solicitud";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const newPhotos = [...uploadedPhotos];
      newPhotos[index] = file;
      setUploadedPhotos(newPhotos);

      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...photoPreviews];
        newPreviews[index] = reader.result as string;
        setPhotoPreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...uploadedPhotos];
    newPhotos.splice(index, 1);
    setUploadedPhotos(newPhotos);

    const newPreviews = [...photoPreviews];
    newPreviews.splice(index, 1);
    setPhotoPreviews(newPreviews);
  };


  const isPriceFilterActive = priceValue > priceMin;
  const isCharacteristicsFilterActive = Object.keys(selectedAmenities).length > 0;

  const saveDraft = () => {
    if (isEditing) return;
    const draft = {
      tiposSeleccionados,
      selectedPropTypeId: selectedPropType?.id,
      activeProvinceName: activeProvince?.nombre,
      finalLocation,
      priceValue,
      currency,
      selectedAmenities,
      descripcion,
      titulo,
      photoPreviews,
      savedAt: Date.now(),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
  };

  useEffect(() => {
    if (isEditing) return;
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw);
      if (draft.tiposSeleccionados) setTiposSeleccionados(draft.tiposSeleccionados);
      if (draft.selectedPropTypeId) {
        setPendingDraft({ selectedPropTypeId: draft.selectedPropTypeId });
      }
      if (draft.activeProvinceName) {
        const province = DOMINICAN_REPUBLIC_LOCATIONS.find(
          (item) => item.nombre === draft.activeProvinceName
        );
        if (province) setActiveProvince(province);
      }
      if (draft.finalLocation) setFinalLocation(draft.finalLocation);
      if (typeof draft.priceValue === "number") setPriceValue(draft.priceValue);
      if (draft.currency) setCurrency(draft.currency);
      if (draft.selectedAmenities) {
        setSelectedAmenities(draft.selectedAmenities);
      }
      if (draft.descripcion) setDescripcion(draft.descripcion);
      if (draft.titulo) setTitulo(draft.titulo);
      if (draft.photoPreviews) {
        setPhotoPreviews(draft.photoPreviews);
        setUploadedPhotos(
          draft.photoPreviews.map(() => new File([], ""))
        );
      }
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    }
    setDraftReady(true);
  }, [isEditing]);

  useEffect(() => {
    if (isEditing) return;
    if (!pendingDraft?.selectedPropTypeId || propertyTypes.length === 0) return;
    const match = propertyTypes.find(
      (type) => type.id === pendingDraft.selectedPropTypeId
    );
    if (match) {
      setSelectedPropType(match);
      setPendingDraft(null);
    }
  }, [pendingDraft, propertyTypes, isEditing]);

  useEffect(() => {
    if (isEditing || !draftReady) return;
    saveDraft();
  }, [
    tiposSeleccionados,
    selectedPropType,
    activeProvince,
    finalLocation,
    priceValue,
    currency,
    selectedAmenities,
    descripcion,
    titulo,
    photoPreviews,
    draftReady,
    isEditing,
  ]);

  if (loading) {
    return (
      <div className="bg-white pt-8 pb-6 px-3 md:px-8 lg:px-12 text-center">
        <p className="text-lg text-gray-600">Cargando datos del formulario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white pt-8 pb-6 px-3 md:px-8 lg:px-12 text-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white pt-8 pb-6 px-3 md:px-8 lg:px-12">
      <div className="w-full">
        <div className="flex items-center justify-between py-2 mb-8">
          <div className="flex items-center gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft size={28} />
              </button>
            )}
            <h1 className="text-2xl md:text-3xl font-black text-gray-900">{isEditing ? "Editar Anuncio" : "Publicar un anuncio"}</h1>
          </div>
        </div>

        {!enviado ? (
          <div className="flex flex-col gap-8 w-full">
            {/* Barra de filtros */}
            <div className="flex items-center justify-between gap-3 overflow-visible py-2 px-1 w-full bg-gradient-to-r from-gray-50 to-transparent rounded-lg p-4 relative z-20">
              {/* Ventas */}
              <div className="flex flex-col items-center flex-1 min-w-max">
                <span className="flex items-center justify-center mb-1">
                  <Home size={24} />
                </span>
                <button
                  onClick={() => handleToggle("SALE")}
                  className={`w-full px-4 py-3 rounded-2xl border transition-all font-bold text-base ${
                    tiposSeleccionados.includes('SALE')
                      ? 'bg-yellow-100 border-yellow-400 text-yellow-600 shadow'
                      : 'bg-white border-gray-300 text-gray-700'
                  } hover:shadow-md focus:outline-none`}
                >
                  ventas
                </button>
              </div>

              {/* Rentas */}
              <div className="flex flex-col items-center flex-1 min-w-max">
                <span className="flex items-center justify-center mb-1">
                  <KeyRound size={24} />
                </span>
                <button
                  onClick={() => handleToggle("RENT")}
                  className={`w-full px-4 py-3 rounded-2xl border transition-all font-bold text-base ${
                    tiposSeleccionados.includes('RENT')
                      ? 'bg-yellow-100 border-yellow-400 text-yellow-600 shadow'
                      : 'bg-white border-gray-300 text-gray-700'
                  } hover:shadow-md focus:outline-none`}
                >
                  rentas
                </button>
              </div>

              {/* Tipo */}
              <Menu as="div" className="relative flex flex-col items-center flex-1 min-w-max">
                <span className="flex items-center justify-center mb-1">
                  <MousePointerClick size={24} />
                </span>
                <Menu.Button className={`w-full px-4 py-3 rounded-2xl border transition-all font-bold text-base ${
                  selectedPropType
                    ? 'bg-yellow-300 text-black border-yellow-300'
                    : 'bg-white border-gray-300 text-gray-700'
                } hover:shadow-md focus:outline-none`}>
                  {selectedPropType?.name || 'tipo'}
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
                  <Menu.Items className="absolute top-full mt-2 w-56 origin-top-left bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <PropertyTypeMenuItems
                      propertyTypes={propertyTypes}
                      isSelected={(type) => selectedPropType?.id === type.id}
                      onToggle={handlePropTypeToggle}
                    />
                  </Menu.Items>
                </Transition>
              </Menu>

              {/* Lugar */}
              <Menu as="div" className="relative flex flex-col items-center flex-1 min-w-max">
                <span className="flex items-center justify-center mb-1">
                  <MapPin size={24} />
                </span>
                <Menu.Button className={`w-full px-4 py-3 rounded-2xl border transition-all font-bold text-base ${
                  finalLocation.length > 0
                    ? 'bg-yellow-300 text-black border-yellow-300'
                    : 'bg-white border-gray-300 text-gray-700'
                } hover:shadow-md focus:outline-none`}>
                  {finalLocation || "lugar o sector"}
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
                  <Menu.Items className="absolute top-full mt-2 w-[40rem] origin-top-left bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="flex h-80">
                      {/* Columna de Provincias */}
                      <div className="w-1/3 border-r border-gray-200 p-2 overflow-y-auto">
                        {DOMINICAN_REPUBLIC_LOCATIONS.map(province => (
                          <button
                            key={province.nombre}
                            onClick={() => setActiveProvince(province)}
                            className={`w-full text-left px-4 py-3 rounded-md font-semibold text-sm transition-colors ${
                              activeProvince?.nombre === province.nombre
                                ? 'bg-yellow-300 text-black'
                                : 'text-gray-700 hover:bg-yellow-100'
                            }`}
                          >
                            {province.nombre}
                          </button>
                        ))}
                      </div>

                      {/* Columna de Municipios */}
                      <div className="w-2/3 p-4 overflow-y-auto">
                        {activeProvince ? (
                          <div>
                            <div className="text-sm font-semibold text-gray-800 mb-3">Municipios en {activeProvince.nombre}</div>
                            <div className="space-y-2">
                              {activeProvince.municipios.map(municipality => (
                                <Menu.Item key={municipality.nombre}>
                                  <button
                                    onClick={() => setFinalLocation(`${municipality.nombre}, ${activeProvince.nombre}`)}
                                    className="w-full text-left px-4 py-2 rounded-md text-sm transition-colors text-gray-700 hover:bg-yellow-100"
                                  >
                                    {municipality.nombre}
                                  </button>
                                </Menu.Item>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-gray-400 py-8">
                            <p className="text-sm">Selecciona una provincia</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              {/* Precio */}
              <Menu as="div" className="relative flex flex-col items-center flex-1 min-w-max">
                <span className="flex items-center justify-center mb-1">
                  <DollarSign size={24} />
                </span>
                <Menu.Button className={`w-full px-4 py-3 rounded-2xl border transition-all font-bold text-base ${
                  isPriceFilterActive
                    ? 'bg-yellow-300 text-black border-yellow-300'
                    : 'bg-white border-gray-300 text-gray-700'
                } hover:shadow-md focus:outline-none`}>
                  {priceValue > priceMin ? formatPrice(priceValue, currency) : "precio"}
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
                  <Menu.Items className="absolute top-full mt-2 w-80 origin-top-left bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="p-4 space-y-4">
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

                      {/* Precio */}
                      <div>
                        <label className="text-sm font-semibold text-gray-800 mb-4 block">Precio</label>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                            <div className="text-sm font-semibold text-gray-700">{formatPrice(priceValue, currency)}</div>
                            <div className="relative flex-1">
                              <span className="absolute inset-y-0 left-2 flex items-center text-xs text-gray-400">MONTO</span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={priceValue === priceMin ? "" : String(priceValue)}
                                onChange={(e) => handlePriceInputChange(e.target.value)}
                                placeholder="0"
                                className="w-full pl-14 pr-2 py-2 text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                          
                          {/* Slider con Track Visual */}
                          <div className="relative h-10 flex items-center">
                            <div className="absolute top-4 left-0 right-0 h-2 bg-gray-200 rounded-lg pointer-events-none z-0"></div>
                            <div
                              className="absolute top-4 h-2 bg-blue-500 rounded-lg pointer-events-none z-10"
                              style={{
                                width: `${(priceValue / priceMax) * 100}%`,
                              }}
                            ></div>
                            <input
                              type="range"
                              min={priceMin}
                              max={priceMax}
                              step={priceStep}
                              value={priceValue}
                              onChange={(e) => handlePriceSliderChange(parseInt(e.target.value, 10))}
                              className="absolute w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer pointer-events-auto z-20 range-input range-thumb-yellow"
                            />
                          </div>
                          <div className="text-center text-gray-700 font-semibold pt-2 border-t border-gray-200">
                            {formatPrice(priceValue, currency)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              {/* Características */}
              <Menu as="div" className="relative flex flex-col items-center flex-1 min-w-max">
                <span className="flex items-center justify-center mb-1">
                  <Box size={24} />
                </span>
                <Menu.Button className={`w-full px-4 py-3 rounded-2xl border transition-all font-bold text-base ${
                  isCharacteristicsFilterActive
                    ? 'bg-yellow-300 text-black border-yellow-300'
                    : 'bg-white border-gray-300 text-gray-700'
                } hover:shadow-md focus:outline-none`}>
                  características
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
                  <Menu.Items className="absolute top-full mt-2 w-full sm:w-96 md:w-[500px] lg:w-[600px] origin-top-right right-0 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <CharacteristicsMenuContent
                      characteristics={characteristics}
                      activeCategory={activeCategory}
                      onActiveCategoryChange={setActiveCategory}
                      selectedAmenities={selectedAmenities}
                      onAmenityChange={handleAmenityChange}
                      isAmenitySelected={isAmenitySelected}
                      showMoreCategories={showMoreCategories}
                      onToggleShowMore={() =>
                        setShowMoreCategories(!showMoreCategories)
                      }
                    />
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>

            {/* Imágenes */}
            <div className="flex flex-col gap-3">
              <label className="text-gray-700 font-bold">Fotos</label>
              <div className="flex flex-wrap gap-4">
                {photoPreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <label
                      className="border-2 border-dashed border-gray-300 rounded-lg h-32 w-32 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group overflow-hidden bg-gray-50"
                    >
                      <img
                        src={preview}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e, index)}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                
                {photoPreviews.length < 5 && (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg h-32 w-32 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group bg-gray-50">
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, photoPreviews.length)}
                    />
                    <Upload className="text-gray-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
                    <span className="text-gray-500 text-xs font-medium">Añadir foto</span>
                  </label>
                )}
              </div>
            </div>

            {/* Título e Descripción */}
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Escribe un un titulo llamativo describiendo el inmueble a promocionar"
                className="border border-gray-300 rounded-lg p-3 h-10 text-sm text-gray-700 resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe aqui  el inmueble que anuncias, o agrega un detalle particular sobre el mismo y tu oferta"
                className="border border-gray-300 rounded-lg p-3 h-32 text-sm text-gray-700 resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4">
              {submitError && (
                <span className="mr-auto text-sm text-red-600">{submitError}</span>
              )}
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-2 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              )}
              <button
                type="button"
                onClick={handleAceptar}
                disabled={!isFormValid || isSubmitting}
                className={`px-8 py-2 font-semibold rounded-lg transition-all ${
                  isFormValid && !isSubmitting
                    ? 'bg-yellow-300 text-gray-900 hover:bg-yellow-400 cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                }`}
              >
                {isSubmitting ? (isEditing ? "Actualizando..." : "Publicando...") : (isEditing ? "Actualizar" : "Publicar")}
              </button>
            </div>
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center text-center max-w-2xl mx-auto">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-2xl">
                ✓
              </div>
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">¡Listo!</h2>
            <p className="text-gray-600 text-lg">
              {isEditing ? "Tu anuncio ha sido actualizado exitosamente." : "Tu anuncio ha sido publicado exitosamente. Será visible para todos en breve."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
