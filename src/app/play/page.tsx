"use client";

import React, { useState } from "react";
import MainMap from "./components/main-map";
import LocationList from "./components/location-list";
import { useList } from "@/lib/api-client/postal-code";

const App = () => {
  const [open, setOpen] = useState(true);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const { data, isLoading } = useList({ page: 1, limit: 500 });
  if (!data?.postalCodes?.length) return null;

  return (
    <main>
      <LocationList
        open={open}
        setOpen={setOpen}
        items={data?.postalCodes}
        mapInstance={mapInstance}
      />
      <MainMap
        items={data?.postalCodes}
        loading={isLoading}
        open={open}
        handleClick={() => setOpen(!open)}
        onMapLoad={setMapInstance}
      />
    </main>
  );
};

export default App;
