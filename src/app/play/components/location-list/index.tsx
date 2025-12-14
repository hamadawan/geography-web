import React from "react";
import LocationCard from "../location-card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LocationListProps {
  open: boolean;
  setOpen: (status: boolean) => void;
  items: any[];
  mapInstance: any;
}

export default function LocationList({ open, setOpen, items, mapInstance }: LocationListProps) {
  const handleItemClick = (item: any) => {
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
  };

  return (
    <div
      className={`${open ? "translate-x-0" : "-translate-x-full"
        } fixed top-0 left-0 h-full bg-white shadow-lg transition-transform duration-500 ease-in-out w-[400px] z-50`}
    >
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Locations</h2>
        <p className="text-sm text-gray-500">
          Select a location to view on the map.
        </p>
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          Close
        </button>
      </div>
      <ScrollArea className="h-[calc(100vh-76px)]">
        <div className="flex flex-col gap-y-4 pb-4 p-4">
          {items?.map((location) => (
            <LocationCard
              key={location.id}
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
