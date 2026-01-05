"use client";

import React, { useState, useMemo, useEffect, ReactNode, useCallback } from "react";
import { useList as usePostalCodeList } from "@/lib/api-client/postal-code";
import { useList as useStateList } from "@/lib/api-client/state";
import { useList as useCountryList } from "@/lib/api-client/country";
import Header from "@/components/header";
import LayerSidebar from "../layer-sidebar";
import StylingSidebar from "../styling-sidebar";
import { useSelectionStore } from "@/lib/store/selection-store";
import maplibre from "maplibre-gl";

interface MapLayoutProps {
    children: (props: {
        currentItems: unknown[];
        loading: boolean;
        mapInstance: maplibre.Map | null;
        setMapInstance: (map: maplibre.Map | null) => void;
        layerType: 'all-countries' | 'country' | 'all-states' | 'state' | 'all-zipcodes' | 'zipcode';
    }) => ReactNode;
}

export default function MapLayout({ children }: MapLayoutProps) {
    const [mapInstance, setMapInstanceState] = useState<maplibre.Map | null>(null);

    const setMapInstance = useCallback((map: maplibre.Map | null) => {
        setMapInstanceState(map);
    }, []);

    const {
        selectedCountry,
        selectedState,
        selectedZip,
    } = useSelectionStore();

    const { data: countriesData, isLoading: isCountriesLoading } = useCountryList({
        paginate: false,
    });

    const { data: statesData, isLoading: isStatesLoading } = useStateList({
        country: selectedCountry?.code,
        paginate: false,
    });

    const { data: postalCodesData, isLoading: isPostalCodesLoading } =
        usePostalCodeList({
            state: selectedState?.code,
            paginate: selectedZip?.code !== "all",
        });

    const currentItems = useMemo(() => {
        if (!selectedCountry) return [];
        if (selectedCountry.code === "all") return countriesData?.countries || [];

        if (!selectedState) return [selectedCountry];
        if (selectedState.code === "all") return statesData?.states || [];

        if (!selectedZip) return [selectedState];
        if (selectedZip.code === "all") return postalCodesData?.postalCodes || [];

        return [selectedZip];
    }, [
        selectedCountry,
        selectedState,
        selectedZip,
        countriesData,
        statesData,
        postalCodesData,
    ]);

    const targetBbox = useMemo(() => {
        if (selectedZip) {
            return selectedZip.code === "all" ? selectedState?.bbox : selectedZip.bbox;
        }
        if (selectedState) {
            return selectedState.code === "all"
                ? selectedCountry?.bbox
                : selectedState.bbox;
        }
        if (selectedCountry && selectedCountry.code !== "all") {
            return selectedCountry.bbox;
        }
        return null;
    }, [selectedCountry, selectedState, selectedZip]);

    useEffect(() => {
        if (mapInstance && targetBbox) {
            try {
                mapInstance.fitBounds(targetBbox as [number, number, number, number], {
                    padding: 50,
                    duration: 1000,
                    essential: true,
                });
            } catch (error) {
                console.error("Error fitting bounds:", error);
            }
        }
    }, [mapInstance, targetBbox]);

    const layerType = useMemo(() => {
        if (!selectedCountry || selectedCountry.code === "all") {
            return "all-countries";
        }
        if (!selectedState) {
            return "country";
        }
        if (selectedState.code === "all") {
            return "all-states";
        }
        if (!selectedZip) {
            return "state";
        }
        if (selectedZip.code === "all") {
            return "all-zipcodes";
        }
        return "zipcode";
    }, [selectedCountry, selectedState, selectedZip]);

    const loading = isCountriesLoading || isStatesLoading || isPostalCodesLoading;

    return (
        <main className="flex flex-col h-screen overflow-hidden">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <LayerSidebar />
                <StylingSidebar />
                {children({ currentItems, loading, mapInstance, setMapInstance, layerType })}
            </div>
        </main>
    );
}
