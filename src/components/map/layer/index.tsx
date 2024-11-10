"use client"

import { useEffect } from 'react';
import { useMap } from '../context';

interface LayerProps {
  geoJsonData: any;
  layerId: string;
  paint: any;
  type?: 'fill' | 'line' | 'circle';
}

const Layer = ({ geoJsonData, layerId, paint }: LayerProps) => {
  const map = useMap();

  useEffect(() => {
    if (!!map && !map?.getSource(layerId)) {
      if (!map?.getSource('geojson')) {
        map.addSource(layerId, {
          type: 'geojson',
          data: geoJsonData,
        });
      }

      if (!map?.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: 'fill',
          source: layerId,
          paint: paint
        });
      }

      return () => {
        if (map?.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
        if (map?.getSource(layerId)) {
          map.removeSource(layerId);
        }
      };
    }
  }, [map, geoJsonData, paint]);

  return null;
};

export default Layer;
