"use client"

import { useEffect } from 'react';
import { useMap } from '../context';
import { LayerSpecification } from 'maplibre-gl';

type LayerProps = LayerSpecification & {
  geoJsonData: any,
  source: any
}

const Layer = ({ id, geoJsonData, source, paint, type }: LayerProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (!map.getSource(source)) {
      map.addSource(source, {
        type: 'geojson',
        data: geoJsonData,
      });
    }

    if (!map.getLayer(id)) {
      map.addLayer({
        id: id,
        type: type,
        source: source,
        paint,
      });
    }

    return () => {
      if (map.getLayer(id)) {
        map.removeLayer(id);
      }
      if (map.getSource(source) && !map.getStyle().layers.some(l => l.source === source && l.id !== id)) {
        map.removeSource(source);
      }
    };
  }, [map, geoJsonData, paint, source, type, id]);

  return null;
};

export default Layer;
