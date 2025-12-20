"use client"

import { useEffect } from 'react';
import { useMap } from '../context';
import { LayerSpecification, GeoJSONSource } from 'maplibre-gl';

type LayerProps = LayerSpecification & {
  geoJsonData: any,
  source: any
}

const Layer = ({ id, geoJsonData, source, paint, type }: LayerProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const sourceExists = map.getSource(source);
    if (sourceExists) {
      const geoJsonSource = map.getSource(source) as GeoJSONSource;
      geoJsonSource.setData(geoJsonData);
    } else {
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
      } as LayerSpecification);
    }

    return () => {
      if (map.getLayer(id)) {
        map.removeLayer(id);
      }
      if (map.getSource(source) && !map.getStyle().layers.some((l: any) => l.source === source && l.id !== id)) {
        map.removeSource(source);
      }
    };
  }, [map, geoJsonData, paint, source, type, id]);

  return null;
};

export default Layer;
