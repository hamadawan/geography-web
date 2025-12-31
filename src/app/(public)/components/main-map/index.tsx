/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import Map from "@/components/map";
import Layer from "@/components/map/layer";
import Marker from "@/components/map/marker";
import { Button } from "@/components/ui/button";
import Loading from "@/components/loading";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants/site";

import { useLayerStore } from "@/lib/store/layer-store";

interface MainMapProps {
  items: any[] | null;
  loading?: boolean;
  className?: string;
  onMapLoad?: (map: any) => void;
  layerType?: 'all-countries' | 'country' | 'all-states' | 'state' | 'all-zipcodes' | 'zipcode';
}


const MainMap = ({
  items,
  loading,
  className = "",
  onMapLoad,
  layerType = 'all-countries',
}: MainMapProps) => {
  const { layers, addLayer, isSidebarOpen, toggleSidebar, setSelectedLayer, selectedLayerId } = useLayerStore();

  const geoJsonData = useMemo(() => {
    if (!items || items.length === 0) return null;

    const baseType = layerType.startsWith('all-')
      ? layerType.slice(4).replace(/ies$/, 'y').replace(/s$/, '')
      : layerType;

    const features = items
      .filter((item) => item.geom_simplified)
      .map((item) => {
        const geom = typeof item.geom_simplified === 'string'
          ? JSON.parse(item.geom_simplified)
          : item.geom_simplified;

        const entityId = `${baseType}:${item.country_code ? item.country_code + ':' : ''}${item.code}`;

        return {
          type: "Feature",
          properties: {
            ...item,
            entityId,
            savedLayerType: baseType,
          },
          geometry: geom,
        };
      });

    return {
      type: "FeatureCollection",
      features,
    };
  }, [items, layerType]);

  const layersRef = React.useRef(layers);
  React.useEffect(() => {
    layersRef.current = layers;
  }, [layers]);

  const handleMapClick = React.useCallback((e: any) => {
    if (!geoJsonData) return;
    if (e.features && e.features.length > 0) {
      const clickedFeature = e.features[0];
      const entityId = clickedFeature.properties.entityId;

      // Check if layer already exists for this entity
      const existingLayer = layersRef.current.find(l => l.entityId === entityId);
      if (existingLayer) {
        setSelectedLayer(existingLayer.id);
        if (!isSidebarOpen) toggleSidebar();
        return;
      }

      // Gather all features belonging to this entity
      const entityFeatures = geoJsonData.features.filter(
        (f: any) => f.properties.entityId === entityId
      );

      const props = clickedFeature.properties;

      const baseFillColor =
        (layerType === 'all-countries' || layerType === 'country') ? "#3b82f6" :
          (layerType === 'all-states' || layerType === 'state') ? "#10b981" :
            "#f59e0b";

      addLayer({
        entityId,
        name: props.name || props.code || `Layer ${layersRef.current.length + 1}`,
        type: props.savedLayerType,
        geoJsonData: {
          type: "FeatureCollection",
          features: entityFeatures
        },
        fillColor: baseFillColor,
        borderColor: "#000000"
      });
    }
  }, [geoJsonData, layerType, addLayer, isSidebarOpen, toggleSidebar, setSelectedLayer]);

  const currentLayerPaint = React.useMemo(() => {
    const defaultFillColor =
      (layerType === 'all-countries' || layerType === 'country') ? "#3b82f6" :
        (layerType === 'all-states' || layerType === 'state') ? "#10b981" :
          "#f59e0b";
    return {
      "fill-color": defaultFillColor,
      "fill-opacity": 0.2,
    };
  }, [layerType]);

  const currentBorderPaint = React.useMemo(() => ({
    "line-color": "#000000",
    "line-width": 1,
    "line-opacity": 0.5
  }), []);

  const renderCurrentLayer = useMemo(() => {
    if (!geoJsonData) return null;

    const sourceId = `current-${layerType}-source`;
    const layerId = `current-${layerType}-layer`;
    const borderId = `current-${layerType}-border`;

    return (
      <React.Fragment key={`current-${layerType}`}>
        <Layer
          id={layerId}
          source={sourceId}
          geoJsonData={geoJsonData}
          type="fill"
          paint={currentLayerPaint}
          onClick={handleMapClick}
        />
        <Layer
          id={borderId}
          source={sourceId}
          geoJsonData={geoJsonData}
          type="line"
          paint={currentBorderPaint}
        />
      </React.Fragment>
    );
  }, [geoJsonData, layerType, currentLayerPaint, currentBorderPaint, handleMapClick]);

  const renderSavedLayers = useMemo(() => {
    return layers.map((layer) => {
      if (!layer.visible) return null;

      return (
        <React.Fragment key={layer.id}>
          <Layer
            id={`${layer.id}-fill`}
            source={`${layer.id}-source`}
            geoJsonData={layer.geoJsonData}
            type="fill"
            paint={{
              "fill-color": layer.fillColor,
              "fill-opacity": layer.opacity,
            }}
          />
          <Layer
            id={`${layer.id}-border`}
            source={`${layer.id}-source`}
            geoJsonData={layer.geoJsonData}
            type="line"
            paint={{
              "line-color": layer.borderColor,
              "line-width": 2,
            }}
          />
        </React.Fragment>
      );
    });
  }, [layers]);

  const sidebarWidth = isSidebarOpen ? (selectedLayerId ? 600 : 300) : 0;

  return (
    <div
      className={`h-[calc(100vh-64px)] ${className} relative transition-all duration-500 ease-in-out overflow-hidden`}
      style={{ width: `calc(100vw - ${sidebarWidth}px)` }}
    >
      <Button
        onClick={toggleSidebar}
        className="rounded-full flex items-center gap-2 shadow-lg absolute top-4 left-4 z-50"
      >
        {isSidebarOpen ? (
          <>
            <ChevronLeft className="h-4 w-4" />
            {SITE_CONFIG.ui.hideLayers}
          </>
        ) : (
          <>
            {SITE_CONFIG.ui.showLayers}
            <ChevronRight className="h-4 w-4" />
          </>
        )}
      </Button>
      <Map
        containerClass={"h-screen w-100 relative"}
        zoom={4}
        center={[-97.6, 38.3]}
        onLoad={onMapLoad}
      >
        {loading && <Loading />}
        {renderCurrentLayer}
        {renderSavedLayers}
        <Marker position={[-97.8, 38.3]}>
          <div>
          </div>
        </Marker>
      </Map>
    </div>
  );
};

export default MainMap;
