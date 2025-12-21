/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import LocationCard from "../location-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SITE_CONFIG } from "@/lib/constants/site";

interface Breadcrumb {
  label: string;
  onClick?: () => void;
}

interface LocationListProps {
  open: boolean;
  setOpen: (status: boolean) => void;
  items: any[];
  mapInstance: any;
  onItemClick: (item: any) => void;
  breadcrumbs: Breadcrumb[];
}

export default function LocationList({
  open,
  items,
  mapInstance,
  onItemClick,
  breadcrumbs
}: LocationListProps) {
  const handleItemClick = (item: any) => {
    if (!mapInstance) return;

    // Use pre-calculated bounding box if available
    if (item.bbox && Array.isArray(item.bbox) && item.bbox.length === 4) {
      const [minLon, minLat, maxLon, maxLat] = item.bbox;
      const centerLon = (minLon + maxLon) / 2;
      const centerLat = (minLat + maxLat) / 2;

      // Calculate appropriate zoom level based on bbox size
      const lonDiff = maxLon - minLon;
      const latDiff = maxLat - minLat;
      const maxDiff = Math.max(lonDiff, latDiff);

      // Smart zoom level calculation
      let zoom = 10;
      if (maxDiff > 20) zoom = 4;       // Large countries
      else if (maxDiff > 10) zoom = 5;  // Medium countries
      else if (maxDiff > 5) zoom = 6;   // Small countries / large states
      else if (maxDiff > 2) zoom = 7;   // Medium states
      else if (maxDiff > 1) zoom = 8;   // Small states
      else if (maxDiff > 0.5) zoom = 9; // Large postal codes
      else zoom = 10;                    // Small postal codes

      mapInstance.flyTo({
        center: [centerLon, centerLat],
        zoom: zoom,
        duration: 1000, // Smooth 1-second animation
      });
    }

    // Always call onItemClick to allow the parent to handle selection logic
    onItemClick(item);
  };

  return (
    <div
      className={`${open ? "translate-x-0" : "-translate-x-full"
        } fixed top-0 left-0 h-full bg-white shadow-lg transition-transform duration-500 ease-in-out w-[400px] z-50`}
    >
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold pb-4">{SITE_CONFIG.name}</h1>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="text-gray-400">/</span>}
                <button
                  onClick={crumb.onClick}
                  disabled={!crumb.onClick}
                  className={`text-sm font-medium ${crumb.onClick ? 'text-blue-600 hover:underline' : 'text-gray-900'}`}
                >
                  {crumb.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-500">
          {breadcrumbs.length === 1 && SITE_CONFIG.ui.selectCountry}
          {breadcrumbs.length === 2 && SITE_CONFIG.ui.selectState}
          {breadcrumbs.length === 3 && SITE_CONFIG.ui.selectPostalCode}
        </p>
      </div>
      <ScrollArea className="h-[calc(100vh-76px)]">
        <div className="flex flex-col gap-y-4 pb-4 p-4">
          {items?.map((location) => (
            <LocationCard
              key={location.id || location.code}
              className="border-none"
              item={location}
              onClick={() => handleItemClick(location)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
