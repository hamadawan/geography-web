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

import { Layer as LayerType } from "@/lib/store/layer-store";
import { useMainMap } from "./use-main-map";
import { MapControls } from "../map-controls";
import { useState } from "react";
import centroid from "@turf/centroid";
import { AllGeoJSON } from "@turf/helpers";

interface MainMapProps {
  items: any[] | null;
  loading?: boolean;
  className?: string;
  onMapLoad?: (map: any) => void;
  layerType?: 'all-countries' | 'country' | 'all-states' | 'state' | 'all-zipcodes' | 'zipcode';
  rightSidebarWidth?: number;
  children?: React.ReactNode;
}


const MainMap = ({
  items,
  loading,
  className = "",
  onMapLoad,
  layerType = 'all-countries',
  rightSidebarWidth = 0,
  children,
}: MainMapProps) => {
  const {
    layers,
    isSidebarOpen,
    toggleSidebar,
    setSelectedLayer,
    selectedLayerId,
    geoJsonData,
    handleMapClick,
    currentLayerPaint,
    currentBorderPaint,
    loadedImages,
    handleMapLoad,
  } = useMainMap({ items, layerType, onMapLoad });

  const [currentProjection, setCurrentProjection] = useState(SITE_CONFIG.map.projections.mercator);
  const [currentStyle, setCurrentStyle] = useState(SITE_CONFIG.map.styles.standard.url);

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
    return layers.map((layer: LayerType) => {
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
              "fill-opacity": layer.fillOpacity,
            }}
            onClick={() => {
              setSelectedLayer(layer.id);
              if (!isSidebarOpen) toggleSidebar();
            }}
          />
          <Layer
            id={`${layer.id}-border`}
            source={`${layer.id}-source`}
            geoJsonData={layer.geoJsonData}
            type="line"
            paint={{
              "line-color": layer.borderColor,
              "line-width": layer.borderWidth,
              "line-opacity": layer.borderOpacity,
              "line-dasharray": layer.borderStyle === 'dashed' ? [2, 2] : layer.borderStyle === 'dotted' ? [1, 1] : [1, 0],
            }}
          />
          {layer.fillImage && loadedImages.has(`image-${layer.id}`) && (
            <Layer
              id={`${layer.id}-image`}
              source={`${layer.id}-source`}
              geoJsonData={layer.geoJsonData}
              type="fill"
              paint={{
                "fill-pattern": `image-${layer.id}`,
              }}
              onClick={() => {
                setSelectedLayer(layer.id);
                if (!isSidebarOpen) toggleSidebar();
              }}
            />
          )}
          {layer.label && (
            <Layer
              id={`${layer.id}-label`}
              source={`${layer.id}-label-source`}
              geoJsonData={centroid(layer.geoJsonData as AllGeoJSON)}
              type="symbol"
              layout={{
                'text-field': layer.label,
                'text-size': layer.textSize || 12,
                'text-anchor': 'center',
                ...Object.keys(layer.customLabelStyles || {}).reduce((acc, key) => {
                  if (key.startsWith('text-') && !['text-color', 'text-halo-color'].includes(key)) {
                    acc[key] = layer.customLabelStyles![key];
                  }
                  return acc;
                }, {} as Record<string, any>)
              }}
              paint={{
                'text-color': layer.textColor || '#000000',
                ...Object.keys(layer.customLabelStyles || {}).reduce((acc, key) => {
                  if (['text-color', 'text-halo-color', 'text-halo-width', 'text-halo-blur'].includes(key)) {
                    acc[key] = layer.customLabelStyles![key];
                  }
                  return acc;
                }, {} as Record<string, any>)
              }}
            />
          )}
        </React.Fragment>
      );
    });
  }, [layers, loadedImages, isSidebarOpen, toggleSidebar, setSelectedLayer]);

  const sidebarWidth = isSidebarOpen ? (selectedLayerId ? 600 : 300) : 0;

  return (
    <div
      className={`h-[calc(100vh-64px)] ${className} relative transition-all duration-500 ease-in-out overflow-hidden`}
      style={{ width: `calc(100vw - ${sidebarWidth + rightSidebarWidth}px)` }}
    >
      <Button
        onClick={toggleSidebar}
        variant="secondary"
        className="rounded-full flex items-center gap-2 shadow-lg absolute top-4 left-4 z-50 bg-white hover:bg-white/90 text-black"
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
        zoom={SITE_CONFIG.map.defaultZoom}
        center={SITE_CONFIG.map.defaultCenter}
        onLoad={handleMapLoad}
        mapStyle={currentStyle}
        projection={currentProjection}
      >
        {loading && <Loading />}
        <MapControls
          currentProjection={currentProjection}
          onProjectionChange={setCurrentProjection}
          currentStyle={currentStyle}
          onStyleChange={setCurrentStyle}
        />
        {renderCurrentLayer}
        {renderSavedLayers}
        {children}
        <Marker position={[-97.8, 38.3]}>
          <div>
          </div>
        </Marker>
      </Map>
    </div>
  );
};

export default MainMap;
