'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import maplibre from 'maplibre-gl';
import { MapProvider } from './context';

interface MapProps {
  mapStyle?: string;
  zoom?: number;
  center?: [number, number];
  projection?: string;
  style?: React.CSSProperties;
  containerClass?: string;
  onLoad?: (mapInstance: maplibre.Map) => void;
  children?: ReactNode;
}

import { SITE_CONFIG } from '@/lib/constants/site';

const DEFAULT_CENTER = SITE_CONFIG.map.defaultCenter;
const DEFAULT_ZOOM = SITE_CONFIG.map.defaultZoom;
const DEFAULT_STYLE = SITE_CONFIG.map.styles.standard.url;

const Map = ({
  mapStyle = DEFAULT_STYLE,
  zoom = DEFAULT_ZOOM,
  center = DEFAULT_CENTER,
  projection = 'globe',
  style,
  containerClass = '',
  onLoad,
  children,
}: MapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<maplibre.Map | null>(null);

  const mapRef = useRef<maplibre.Map | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = new maplibre.Map({
        container: mapContainerRef.current,
        style: mapStyle,
        center,
        zoom,
        attributionControl: false,
      });

      map.on('style.load', () => {
        if (!mapRef.current) {
          mapRef.current = map;
          setMapInstance(map);
          map.setProjection({ type: projection });
          if (onLoad) {
            onLoad(map)
          }
        }
      });

      return () => {
        map.remove();
        mapRef.current = null;
        setMapInstance(null);
      };
    }
  }, []);

  useEffect(() => {
    if (mapInstance && mapStyle) {
      mapInstance.setStyle(mapStyle);
      mapInstance.once('styledata', () => {
        mapInstance.setProjection({ type: projection });
      });
    }
  }, [mapInstance, mapStyle]);

  useEffect(() => {
    if (mapInstance) {
      mapInstance.setProjection({ type: projection });
    }
  }, [mapInstance, projection]);


  return (
    <div
      ref={mapContainerRef}
      style={style}
      className={`${containerClass} ${projection === 'globe' ? 'globe-background' : 'bg-blue-50'}`}
    >
      {mapInstance && <MapProvider value={mapInstance}>{children}</MapProvider>}
    </div>
  );
};

export default Map;
