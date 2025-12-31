/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    
    const query = searchQuery.toLowerCase();
    return items.filter((item) =>
      item.name?.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  const handleItemClick = (item: any) => {
    if (!mapInstance) return;

    if (item.bbox && Array.isArray(item.bbox) && item.bbox.length === 4) {
      const [minLon, minLat, maxLon, maxLat] = item.bbox;

      mapInstance.fitBounds(
        [
          [minLon, minLat],
          [maxLon, maxLat] 
        ],
        {
          padding: 50,     
          duration: 1000,  
          maxZoom: 15      
        }
      );
    }
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
        <p className="text-sm text-gray-500 mb-4">
          {breadcrumbs.length === 1 && SITE_CONFIG.ui.selectCountry}
          {breadcrumbs.length === 2 && SITE_CONFIG.ui.selectState}
          {breadcrumbs.length === 3 && SITE_CONFIG.ui.selectPostalCode}
        </p>
        <input
          type="text"
          placeholder="Search locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <ScrollArea className="h-[calc(100vh-76px)]">
        <div className="flex flex-col gap-y-4 pb-4 p-4">
          {filteredItems?.length > 0 ? (
            filteredItems.map((location) => (
              <LocationCard
                key={location.id || location.code}
                className="border-none"
                item={location}
                onClick={() => handleItemClick(location)}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No locations found</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}