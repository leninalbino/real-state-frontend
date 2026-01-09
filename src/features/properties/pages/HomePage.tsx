import { useState } from "react";
import { HeroSection, SearchBar, ContentSearch } from "..";
import { useAmenitySelection } from "../hooks/useAmenitySelection";
import type { PropertyType } from "../services/formService";
import type { ListingType } from "../types";

const Home = () => {
  const [tiposSeleccionados, setTiposSeleccionados] = useState<ListingType[]>(
    ["SALE", "RENT"]
  );
  const [selectedPropTypes, setSelectedPropTypes] = useState<PropertyType[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 500000,
  });
  const [locationInput, setLocationInput] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const {
    selectedAmenities,
    handleAmenityChange,
    isAmenitySelected,
  } = useAmenitySelection("multi");

  return (
    <div className="w-full">
      <HeroSection />

      <div className="relative z-10 px-4">
        <SearchBar
          tiposSeleccionados={tiposSeleccionados}
          setTiposSeleccionados={setTiposSeleccionados}
          selectedPropTypes={selectedPropTypes}
          setSelectedPropTypes={setSelectedPropTypes}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          locationInput={locationInput}
          setLocationInput={setLocationInput}
          setSelectedLocation={setSelectedLocation}
          selectedAmenities={selectedAmenities}
          onAmenityChange={handleAmenityChange}
          isAmenitySelected={isAmenitySelected}
        />
      </div>

      <div className="mt-12">
        <ContentSearch
          tipos={tiposSeleccionados}
          selectedPropTypes={selectedPropTypes}
          priceRange={priceRange}
          locationQuery={selectedLocation}
          selectedAmenities={selectedAmenities}
        />
      </div>
    </div>
  );
};

export default Home;
