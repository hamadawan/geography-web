"use client";

import React, { useState, useMemo, useEffect } from "react";
import MainMap from "./components/main-map";
import { useList as usePostalCodeList } from "@/lib/api-client/postal-code";
import { useList as useStateList } from "@/lib/api-client/state";
import { useList as useCountryList } from "@/lib/api-client/country";
import Header from "@/components/header";

const App = () => {
  const [open, setOpen] = useState(true);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedZip, setSelectedZip] = useState<any>(null);

  const { data: countriesData, isLoading: isCountriesLoading } = useCountryList({
    paginate: false,
  });

  const { data: statesData, isLoading: isStatesLoading } = useStateList({
    country: selectedCountry?.code,
    paginate: false,
  });

  const { data: postalCodesData, isLoading: isPostalCodesLoading } =
    usePostalCodeList({
      state: selectedState?.code,
      paginate: selectedZip?.code !== "all",
    });

  const currentItems = useMemo(() => {
    if (!selectedCountry) return [];
    if (selectedCountry.code === "all") return countriesData?.countries || [];

    if (!selectedState) return [selectedCountry];
    if (selectedState.code === "all") return statesData?.states || [];

    if (!selectedZip) return [selectedState];
    if (selectedZip.code === "all") return postalCodesData?.postalCodes || [];

    return [selectedZip];
  }, [
    selectedCountry,
    selectedState,
    selectedZip,
    countriesData,
    statesData,
    postalCodesData,
  ]);

  const targetBbox = useMemo(() => {
    if (selectedZip) {
      return selectedZip.code === "all" ? selectedState?.bbox : selectedZip.bbox;
    }
    if (selectedState) {
      return selectedState.code === "all"
        ? selectedCountry?.bbox
        : selectedState.bbox;
    }
    if (selectedCountry && selectedCountry.code !== "all") {
      return selectedCountry.bbox;
    }
    return null;
  }, [selectedCountry, selectedState, selectedZip]);

  useEffect(() => {
    if (mapInstance && targetBbox) {
      try {
        mapInstance.fitBounds(targetBbox, {
          padding: 50,
          duration: 1000,
          essential: true,
        });
      } catch (error) {
        console.error("Error fitting bounds:", error);
      }
    }
  }, [mapInstance, targetBbox]);

  const layerType = useMemo(() => {
    if (!selectedCountry || selectedCountry.code === "all") {
      return "country";
    }
    if (!selectedState || selectedState.code === "all") {
      return "state";
    }
    return "postal-code";
  }, [selectedCountry, selectedState]);

  return (
    <main>
      <Header
        selectedCountry={selectedCountry}
        selectedState={selectedState}
        selectedZip={selectedZip}
        onCountryChange={setSelectedCountry}
        onStateChange={setSelectedState}
        onZipChange={setSelectedZip}
        onExport={() => {
          console.log("Export clicked");
        }}
      />
      <MainMap
        items={currentItems}
        loading={isCountriesLoading || isStatesLoading || isPostalCodesLoading}
        open={open}
        handleClick={() => setOpen(!open)}
        onMapLoad={setMapInstance}
        layerType={layerType}
      />
    </main>
  );
};

export default App;
