import { useRef } from "react";
import { useLayerStore } from "@/lib/store/layer-store";
import { exportLayersToGeoJSON, importLayersFromGeoJSON } from "@/lib/utils/layer-utils";

export const useLayerSidebar = () => {
    const { layers, addLayers } = useLayerStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        if (layers.length === 0) return;

        const fileName = layers.length === 1 ? layers[0].name : `${layers[0].name}-and-others`;
        const geoJsonString = exportLayersToGeoJSON(layers);
        const blob = new Blob([geoJsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${fileName}.geojson`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const geoJson = JSON.parse(content);
                const importedLayers = importLayersFromGeoJSON(geoJson);
                addLayers(importedLayers);
            } catch (error) {
                console.error("Failed to import layers:", error);
                alert("Failed to import layers. Please ensure the file is a valid GeoJSON.");
            }
        };
        reader.readAsText(file);

        // Reset input
        if (event.target) {
            event.target.value = "";
        }
    };

    const triggerImport = () => {
        fileInputRef.current?.click();
    };

    return {
        handleExport,
        handleImport,
        triggerImport,
        fileInputRef,
        canExport: layers.length > 0,
    };
};
