"use client";

import React, { useState, useCallback, ReactNode } from "react";
import Header from "@/components/header";
import LayerSidebar from "../layer-sidebar";
import StylingSidebar from "../styling-sidebar";
import { MapLoading } from "@/components/map-loading";
import { useMapLayout } from "./use-map-layout";
import maplibre from "maplibre-gl";

interface MapLayoutProps {
    children: (props: {
        mapInstance: maplibre.Map | null;
        setMapInstance: (map: maplibre.Map | null) => void;
    }) => ReactNode;
}

export default function MapLayout({ children }: MapLayoutProps) {
    const [mapInstance, setMapInstanceState] = useState<maplibre.Map | null>(null);

    const setMapInstance = useCallback((map: maplibre.Map | null) => {
        setMapInstanceState(map);
    }, []);

    const { isCountriesLoading } = useMapLayout();

    return (
        <main className="flex flex-col h-screen overflow-hidden bg-background">
            <Header showAddLayerButton={true} showSelectors={false} />
            <div className="flex flex-1 overflow-hidden relative">
                {isCountriesLoading && (
                    <div className="absolute left-0 right-0 top-0 bottom-0 z-[10] flex items-center justify-center animate-in fade-in duration-500">
                        <MapLoading />
                    </div>
                )}
                <LayerSidebar />
                <StylingSidebar />
                <div className="flex-1 relative">
                    {children({ mapInstance, setMapInstance })}
                </div>
            </div>
        </main>
    );
}
