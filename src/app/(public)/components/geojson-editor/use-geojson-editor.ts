/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from "react";
import { useLayerStore } from "@/lib/store/layer-store";
import { SITE_CONFIG } from "@/lib/constants/site";
import { prepareGeoJsonForLayer, calculateBoundingBox } from "@/lib/utils/geojson-utils";

interface UseGeoJsonEditorProps {
    onFitBounds?: (bbox: [number, number, number, number]) => void;
}

export function useGeoJsonEditor({ onFitBounds }: UseGeoJsonEditorProps) {
    const [geoJsonString, setGeoJsonString] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const { layers, addLayer, updateLayer } = useLayerStore();

    const editorLayer = useMemo(
        () => layers.find(l => l.entityId === 'editor-layer'),
        [layers]
    );

    const parsedGeoJson = useMemo(() => {
        if (!geoJsonString.trim()) {
            setError(null);
            return null;
        }

        try {
            const parsed = JSON.parse(geoJsonString);
            if (!parsed.type) {
                setError("Invalid GeoJSON: Missing 'type' property.");
                return null;
            }
            setError(null);
            return parsed;
        } catch (e: any) {
            setError(`JSON Parse Error: ${e.message}`);
            return null;
        }
    }, [geoJsonString]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (parsedGeoJson && !error) {
                const finalGeoJson = prepareGeoJsonForLayer(parsedGeoJson);
                if (editorLayer) {
                    updateLayer(editorLayer.id, {
                        geoJsonData: finalGeoJson,
                        visible: true
                    });
                } else {
                    addLayer({
                        entityId: 'editor-layer',
                        name: 'Editor Layer',
                        type: 'country',
                        geoJsonData: finalGeoJson,
                        fillColor: SITE_CONFIG.map.layerStyles.country.fillColor,
                        borderColor: SITE_CONFIG.map.layerStyles.country.borderColor,
                    });
                }
                if (onFitBounds) {
                    const bbox = finalGeoJson.bbox || calculateBoundingBox(finalGeoJson.features);
                    if (bbox) {
                        onFitBounds(bbox);
                    }
                }
            }
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [parsedGeoJson]);

    const handleFormat = () => {
        if (!parsedGeoJson) return;
        setGeoJsonString(JSON.stringify(parsedGeoJson, null, 2));
    };

    const handleClear = () => {
        setGeoJsonString("");
        setError(null);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(geoJsonString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFitBounds = () => {
        if (!parsedGeoJson || !onFitBounds) return;

        const features = parsedGeoJson.type === "FeatureCollection"
            ? parsedGeoJson.features
            : parsedGeoJson.type === "Feature"
                ? [parsedGeoJson]
                : [];

        if (features.length === 0) return;

        const bbox = parsedGeoJson.bbox || calculateBoundingBox(features);
        if (bbox) {
            onFitBounds(bbox);
        }

    };

    return {
        geoJsonString,
        setGeoJsonString,
        error,
        copied,
        parsedGeoJson,
        handleFormat,
        handleClear,
        handleCopy,
        handleFitBounds,
    };
}
