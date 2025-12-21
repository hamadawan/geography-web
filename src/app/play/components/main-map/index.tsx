/* eslint-disable @typescript-eslint/no-explicit-any */
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
  boundary?: any;
  layerType?: 'country' | 'state' | 'postal-code';
}


const MainMap = ({
  handleClick,
  items,
  loading,
  className,
  open,
  onMapLoad,
  layerType = 'postal-code',
}: MainMapProps) => {

  const geoJsonData = useMemo(() => {
    if (!items || items.length === 0) return null;

    const features = items
      .filter((item) => item.geom_simplified)
      .map((item) => {
        const geom = typeof item.geom_simplified === 'string'
          ? JSON.parse(item.geom_simplified)
          : item.geom_simplified;

        return {
          type: "Feature",
          properties: item,
          geometry: geom,
        };
      });

    return {
      type: "FeatureCollection",
      features,
    };
  }, [items]);

  const renderLayers = useMemo(() => {
    if (!geoJsonData) return null;

    const sourceId = `${layerType}-source`;
    const layerId = `${layerType}-layer`;
    const borderId = `${layerType}-border`;

    return (
      <React.Fragment key={layerType}>
        <Layer
          id={layerId}
          source={sourceId}
          geoJsonData={geoJsonData}
          type="fill"
          paint={{
            "fill-color": layerType === 'country' ? "#3b82f6" : layerType === 'state' ? "#10b981" : "#f59e0b",
            "fill-opacity": 0.3,
          }}
        />
        <Layer
          id={borderId}
          source={sourceId}
          geoJsonData={geoJsonData}
          type="line"
          paint={{
            "line-color": "#000",
            "line-width": [
              "interpolate",
              ["linear"],
              ["zoom"],
              7, 0.2,
              10, 0.5,
              12, 1
            ],
            "line-opacity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              7, 0.5,
              10, 0.8,
              12, 1
            ]
          }}
        />
      </React.Fragment>
    );
  }, [geoJsonData, layerType]);

  return (
    <div
      className={`h-screen ml-auto ${className} transition-all ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:w-[calc(100vw-400px)] data-[state=closed]:w-screen overflow-hidden`}
      data-state={open ? "open" : "closed"}
    >
      <Map
        containerClass={"h-screen w-100 relative"}
        zoom={4}
        center={[-97.6, 38.3]}
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
