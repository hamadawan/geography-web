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
  const mapRef = React.useRef<any>(null);

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

      const existingLayer = layersRef.current.find(l => l.entityId === entityId);
      if (existingLayer) {
        setSelectedLayer(existingLayer.id);
        if (!isSidebarOpen) toggleSidebar();
        return;
      }

      const entityFeatures = geoJsonData.features.filter(
        (f: any) => f.properties.entityId === entityId
      );

      const props = clickedFeature.properties;

      const style = SITE_CONFIG.map.layerStyles[props.savedLayerType as keyof typeof SITE_CONFIG.map.layerStyles];
      const baseFillColor = style.fillColor;

      addLayer({
        entityId,
        name: props.name || props.code || `Layer ${layersRef.current.length + 1}`,
        type: props.savedLayerType,
        geoJsonData: {
          type: "FeatureCollection",
          features: entityFeatures
        },
        fillColor: baseFillColor,
        borderColor: style.borderColor,
        bbox: props.bbox ? (typeof props.bbox === 'string' ? JSON.parse(props.bbox) : props.bbox) : undefined
      });
    }
  }, [geoJsonData, layerType, addLayer, isSidebarOpen, toggleSidebar, setSelectedLayer]);

  const currentLayerPaint = React.useMemo(() => {
    const style = SITE_CONFIG.map.layerStyles[layerType];
    const defaultFillColor = style.fillColor;
    return {
      "fill-color": defaultFillColor,
      "fill-opacity": SITE_CONFIG.map.preview.fillOpacity,
    };
  }, [layerType]);

  const currentBorderPaint = React.useMemo(() => ({
    "line-color": SITE_CONFIG.map.preview.borderColor,
    "line-width": SITE_CONFIG.map.preview.borderWidth,
    "line-opacity": SITE_CONFIG.map.preview.borderOpacity
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
        </React.Fragment>
      );
    });
  }, [layers]);

  React.useEffect(() => {
    if (selectedLayerId && mapRef.current) {
      const layer = layers.find(l => l.id === selectedLayerId);
      if (layer && layer.bbox) {
        mapRef.current.fitBounds(layer.bbox, {
          padding: 100,
          duration: 1500,
          essential: true
        });
      }
    }
  }, [selectedLayerId, layers]);

  const handleMapLoad = (map: any) => {
    mapRef.current = map;
    if (onMapLoad) onMapLoad(map);
  };

  const sidebarWidth = isSidebarOpen ? (selectedLayerId ? 600 : 300) : 0;

  return (
    <div
      className={`h-[calc(100vh-64px)] ${className} relative transition-all duration-500 ease-in-out overflow-hidden`}
      style={{ width: `calc(100vw - ${sidebarWidth}px)` }}
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
        zoom={4}
        center={[-97.6, 38.3]}
        onLoad={handleMapLoad}
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
