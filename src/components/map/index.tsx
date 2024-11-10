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

const Map = ({
  mapStyle = 'https://tiles.openfreemap.org/styles/liberty',
  zoom = 7,
  center = [-97.60330078860761, 38.28943896611448],
  style,
  containerClass = '',
  onLoad,
  children,
}: MapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<maplibre.Map | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapInstance) {
      const map = new maplibre.Map({
        container: mapContainerRef.current,
        style: mapStyle,
        center,
        zoom,
        attributionControl: false,
      });

      map.on('style.load', () => {
        setMapInstance(map);
        if (onLoad) onLoad(map);
      });
      return () => map.remove();
    }
  }, []);

  return (
    <div ref={mapContainerRef} style={style} className={containerClass}>
      {mapInstance && <MapProvider value={mapInstance}>{children}</MapProvider>}
    </div>
  );
};

export default Map;
