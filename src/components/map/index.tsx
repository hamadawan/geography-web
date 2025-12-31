'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import maplibre from 'maplibre-gl';
import { MapProvider } from './context';

interface MapProps {
  mapStyle?: string;
  zoom?: number;
  center?: [number, number];
  style?: React.CSSProperties;
  containerClass?: string;
  onLoad?: (mapInstance: maplibre.Map) => void;
  children?: ReactNode;
}

const DEFAULT_CENTER: [number, number] = [-97.60330078860761, 38.28943896611448];
const DEFAULT_ZOOM = 7;
const DEFAULT_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

const Map = ({
  mapStyle = DEFAULT_STYLE,
  zoom = DEFAULT_ZOOM,
  center = DEFAULT_CENTER,
  style,
  containerClass = '',
  onLoad,
  children,
}: MapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<maplibre.Map | null>(null);

  const mapRef = useRef<maplibre.Map | null>(null);
  const onLoadRef = useRef(onLoad);

  useEffect(() => {
    onLoadRef.current = onLoad;
  }, [onLoad]);

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
        mapRef.current = map;
        setMapInstance(map);
        if (onLoadRef.current) onLoadRef.current(map);
      });

      return () => {
        map.remove();
        mapRef.current = null;
        setMapInstance(null);
      };
    }
  }, [mapStyle]);

  return (
    <div ref={mapContainerRef} style={style} className={containerClass} >
      {mapInstance && <MapProvider value={mapInstance}>{children}</MapProvider>}
    </div>
  );
};

export default Map;
