/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import MainMap from "./components/main-map";
import LocationList from "./components/location-list";
import { useList as usePostalCodeList } from "@/lib/api-client/postal-code";
import { useList as useStateList } from "@/lib/api-client/state";
import { useList as useCountryList } from "@/lib/api-client/country";
import { SITE_CONFIG } from "@/lib/constants/site";

const App = () => {
  const [open, setOpen] = useState(true);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<any>(null);

  const { data: countriesData, isLoading: isCountriesLoading } = useCountryList({
    paginate: false,
  });

  const { data: statesData, isLoading: isStatesLoading } = useStateList({
    country: selectedCountry?.code,
    paginate: false,
  });

  const { data: postalCodesData, isLoading: isPostalCodesLoading } = usePostalCodeList({
    state: selectedState?.code,
    paginate: false,
  });

  const currentItems = useMemo(() => {
    if (!selectedCountry) return countriesData?.countries || [];
    if (!selectedState) return statesData?.states || [];
    return postalCodesData?.postalCodes || [];
  }, [selectedCountry, selectedState, countriesData, statesData, postalCodesData]);

  const handleItemClick = (item: any) => {
    if (!selectedCountry) {
      setSelectedCountry(item);
    } else if (!selectedState) {
      setSelectedState(item);
    }
  };

  const breadcrumbs = useMemo(() => {
    const crumbs = [
      {
        label: SITE_CONFIG.ui.breadcrumbs.countries,
        onClick: selectedCountry ? () => { setSelectedCountry(null); setSelectedState(null); } : undefined
      }
    ];

    if (selectedCountry) {
      crumbs.push({
        label: selectedCountry.name,
        onClick: selectedState ? () => setSelectedState(null) : undefined
      });
    }

    if (selectedState) {
      crumbs.push({
        label: selectedState.name,
        onClick: undefined
      });
    }

    return crumbs;
  }, [selectedCountry, selectedState]);

  return (
    <main>
      <LocationList
        open={open}
        setOpen={setOpen}
        items={currentItems}
        mapInstance={mapInstance}
        onItemClick={handleItemClick}
        breadcrumbs={breadcrumbs}
      />
      <MainMap
        items={currentItems}
        loading={isCountriesLoading || isStatesLoading || isPostalCodesLoading}
        open={open}
        handleClick={() => setOpen(!open)}
        onMapLoad={setMapInstance}
        layerType={!selectedCountry ? 'country' : !selectedState ? 'state' : 'postal-code'}
      />
    </main>
  );
};

export default App;
