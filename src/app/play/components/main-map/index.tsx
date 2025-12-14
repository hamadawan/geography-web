"use client";

import React, { useMemo } from "react";
import Map from "@/components/map";
import Layer from "@/components/map/layer";
import Marker from "@/components/map/marker";
import { Button } from "@/components/ui/button";
import Loading from "@/components/loading";

interface MainMapProps {
  items: any[];
  loading: boolean;
  className?: string;
  open: boolean;
  handleClick: () => void;
  onMapLoad: (map: any) => void;
}

const buildFeature = (item: any) => {
  const { geom_simplified: geom, ...rest } = item;
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: rest,
        geometry: typeof geom === 'string' ? JSON.parse(geom) : geom,
      },
    ],
  };
};

const MainMap = ({
  handleClick,
  items,
  loading,
  className,
  open,
  onMapLoad,
}: MainMapProps) => {
  const renderLayers = useMemo(() => {
    return items?.map((item) => {
      if (!item.geom_simplified) return;
      const feature = buildFeature(item);
      return (
        <React.Fragment key={item.id}>
          <Layer
            key={`fill-${item.id}`}
            id={`postal-code-layer-${item.id}`}
            source={`postal-code-layer-${item.id}`}
            geoJsonData={feature}
            type="fill"
            paint={{
              "fill-color": "#f00",
              "fill-opacity": 0.4,
            }}
          />
          <Layer
            key={`line-${item.id}`}
            id={`postal-code-border-${item.id}`}
            source={`postal-code-layer-${item.id}`}
            geoJsonData={feature}
            type="line"
            paint={{
              "line-color": "#000",
              "line-width": 1,
            }}
          />
        </React.Fragment>
      );
    });
  }, [items]);

  return (
    <div
      className={`h-screen ml-auto ${className} transition-all ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:w-[calc(100vw-400px)] data-[state=closed]:w-screen overflow-hidden`}
      data-state={open ? "open" : "closed"}
    >
      <Map
        containerClass={"h-screen w-100 relative"}
        zoom={7}
        center={[-53, 48]}
        onLoad={onMapLoad}
      >
        {loading && <Loading />}
        {renderLayers}
        <Marker position={[-97.8, 38.3]}>
          <div>
            <Button onClick={handleClick}>Here</Button>
          </div>
        </Marker>
      </Map>
    </div>
  );
};

export default MainMap;
