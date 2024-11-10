import React, { useEffect, useRef, useState } from 'react';
import { useMap } from '../context';

interface InfoCardProps {
  position: [number, number];
  children: React.ReactNode;
}

const InfoCardOverlay = ({ position, children }: InfoCardProps) => {
  const map = useMap();
  const [overlayPosition, setOverlayPosition] = useState<{ x: number; y: number } | null>(null);
  const infoCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (map && position) {
      const updateOverlayPosition = () => {
        const pos = map.project(position);
        setOverlayPosition({ x: pos.x, y: pos.y });
      };

      updateOverlayPosition();

      map.on('move', updateOverlayPosition);
      map.on('zoom', updateOverlayPosition);

      return () => {
        map.off('move', updateOverlayPosition);
        map.off('zoom', updateOverlayPosition);
      };
    }
  }, [map, position]);

  if (!overlayPosition) return null;

  return (
    <div
      ref={infoCardRef}
      style={{
        position: 'absolute',
        left: overlayPosition.x,
        top: overlayPosition.y,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <div>
        {children}
      </div>
    </div>
  );
};

export default InfoCardOverlay;
