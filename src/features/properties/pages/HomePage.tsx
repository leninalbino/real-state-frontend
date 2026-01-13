import { useState } from "react";
import { HeroSection, SearchBar, ContentSearch } from "..";
import { useAmenitySelection } from "../hooks/useAmenitySelection";
import type { PropertyType } from "../services/formService";
import type { ListingType } from "../types";
import { AppLayout } from "../../../app/layout/AppLayout";

const Home = () => {
  const [tiposSeleccionados, setTiposSeleccionados] = useState<ListingType[]>(
    ["SALE", "RENT"]
  );
  const [selectedPropTypes, setSelectedPropTypes] = useState<PropertyType[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 500000,
  });
  const [selectedLocation, setSelectedLocation] = useState("");
  const {
    selectedAmenities,
    handleAmenityChange,
  } = useAmenitySelection("multi");

  return (
    <AppLayout
      headerCenterContent={
        <SearchBar
          tiposSeleccionados={tiposSeleccionados}
          setTiposSeleccionados={setTiposSeleccionados}
          selectedPropTypes={selectedPropTypes}
          setSelectedPropTypes={setSelectedPropTypes}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          setSelectedLocation={setSelectedLocation}
          selectedAmenities={selectedAmenities}
          onAmenityChange={handleAmenityChange}
          variant="header"
        />
      }
    >
      <div className="w-full">
        <HeroSection />
        <div>
          <ContentSearch
            tipos={tiposSeleccionados}
            selectedPropTypes={selectedPropTypes}
            priceRange={priceRange}
            locationQuery={selectedLocation}
            selectedAmenities={selectedAmenities}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Home;
