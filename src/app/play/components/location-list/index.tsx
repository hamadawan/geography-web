/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import LocationCard from "../location-card";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  setOpen,
  items,
  mapInstance,
  onItemClick,
  breadcrumbs
}: LocationListProps) {
  const handleItemClick = (item: any) => {
    // If it has geometry, it's a postal code (or leaf node), so fly to it
    if (item.geom_simplified) {
      if (!mapInstance) return;
      const geom = typeof item.geom_simplified === 'string'
        ? JSON.parse(item.geom_simplified)
        : item.geom_simplified;

      if (!geom || !geom.coordinates) return;

      // Simple bounding box calculation to find center
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

      const processCoords = (coords: any[]) => {
        coords.forEach((coord) => {
          if (Array.isArray(coord[0])) {
            processCoords(coord);
          } else {
            const [x, y] = coord;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        });
      };

      processCoords(geom.coordinates);

      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      mapInstance.flyTo({
        center: [centerX, centerY],
        zoom: 10,
      });
    }

    // Always call onItemClick to allow the parent to handle selection logic
    // (e.g., switching from state to postal code level)
    onItemClick(item);
  };

  return (
    <div
      className={`${open ? "translate-x-0" : "-translate-x-full"
        } fixed top-0 left-0 h-full bg-white shadow-lg transition-transform duration-500 ease-in-out w-[400px] z-50`}
    >
      <div className="p-4 border-b">
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
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-800"
          >
            Close
          </button>
        </div>
        <p className="text-sm text-gray-500">
          Select a location to view on the map.
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
