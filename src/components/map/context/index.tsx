"use client"

import { createContext, useContext } from 'react';
import maplibre from 'maplibre-gl';

const MapContext = createContext<maplibre.Map | null>(null);

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};

export const MapProvider = MapContext.Provider;
