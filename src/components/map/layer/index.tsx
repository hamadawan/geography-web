"use client"

import { useEffect, useRef } from 'react';
import { useMap } from '../context';
import { LayerSpecification, GeoJSONSource, MapLayerMouseEvent } from 'maplibre-gl';

type LayerProps = LayerSpecification & {
  geoJsonData: unknown,
  source: string,
  onClick?: (e: MapLayerMouseEvent) => void
}

const Layer = ({ id, geoJsonData, source, paint, type, onClick }: LayerProps) => {
  const map = useMap();
  const geoJsonDataRef = useRef(geoJsonData);

  useEffect(() => {
    geoJsonDataRef.current = geoJsonData;
  }, [geoJsonData]);

  useEffect(() => {
    if (!map || !source) return;

    const addSource = () => {
      if (!map.getSource(source)) {
        map.addSource(source, {
          type: 'geojson',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: geoJsonDataRef.current as any,
        });
      }
    };

    addSource();
    map.on('styledata', addSource);

    return () => {
      map.off('styledata', addSource);
      try {
        if (map && map.getStyle() && map.getSource(source)) {
          // Only remove if no other layers are using it
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const layersUsingSource = map.getStyle().layers?.filter((l) => (l as any).source === source) || [];
          if (layersUsingSource.length === 0) {
            map.removeSource(source);
          }
        }
      } catch (e) {
        console.warn('Error cleaning up map source:', e);
      }
    };
  }, [map, source]);

  useEffect(() => {
    if (!map || !source || !geoJsonData) return;
    const existingSource = map.getSource(source) as GeoJSONSource;
    if (existingSource) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      existingSource.setData(geoJsonData as any);
    }
  }, [map, source, geoJsonData]);

  useEffect(() => {
    if (!map || !id || !source) return;

    const addLayer = () => {
      if (!map.getLayer(id) && map.getSource(source)) {
        map.addLayer({
          id,
          type,
          source,
          paint,
        } as LayerSpecification);
      }
    };

    addLayer();
    map.on('styledata', addLayer);

    return () => {
      map.off('styledata', addLayer);
      try {
        if (map && map.getStyle() && map.getLayer(id)) {
          map.removeLayer(id);
        }
      } catch (e) {
        console.warn('Error cleaning up map layer:', e);
      }
    };
  }, [map, id, source, type, paint]);

  // Layer property updates
  useEffect(() => {
    if (!map || !id || !map.getLayer(id)) return;
    if (paint) {
      Object.entries(paint).forEach(([key, value]) => {
        map.setPaintProperty(id, key, value);
      });
    }
  }, [map, id, paint]);

  // Event management
  useEffect(() => {
    if (!map || !id || !onClick) return;

    const handleClick = (e: MapLayerMouseEvent) => {
      onClick(e);
    };

    map.on('click', id, handleClick);
    map.on('mouseenter', id, () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', id, () => {
      map.getCanvas().style.cursor = '';
    });

    return () => {
      map.off('click', id, handleClick);
      if (map.getCanvas()) {
        map.getCanvas().style.cursor = '';
      }
    };
  }, [map, id, onClick]);

  return null;
};

export default Layer;
