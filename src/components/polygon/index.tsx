"use client"

import React, { useEffect } from "react";
import { GeoJSONSource, Map as MapLibreMap } from "maplibre-gl";

interface PolygonProps {
  map?: MapLibreMap;
  geoJsonData: GeoJSON.FeatureCollection;
}

export const Polygon: React.FC<PolygonProps> = ({ map, geoJsonData }) => {
  useEffect(() => {
    if (!map) return;

    const sourceId = "polygon-data";

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data: geoJsonData,
      });

      map.addLayer({
        id: "polygon-fill",
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": "#088",
          "fill-opacity": 0.5,
        },
      });

      map.addLayer({
        id: "polygon-border",
        type: "line",
        source: sourceId,
        paint: {
          "line-color": "#000",
          "line-width": 2,
        },
      });
    } else {
      const source = map.getSource(sourceId) as GeoJSONSource;
      source.setData(geoJsonData);
    }

    return () => {
      try {
        if (!map || !map.getStyle()) return;
        if (map.getLayer("polygon-fill")) map.removeLayer("polygon-fill");
        if (map.getLayer("polygon-border")) map.removeLayer("polygon-border");
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      } catch (e) {
        console.warn('Error cleaning up polygon:', e);
      }
    };
  }, [map, geoJsonData]);

  return null;
};
