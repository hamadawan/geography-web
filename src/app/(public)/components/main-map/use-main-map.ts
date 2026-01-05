/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useCallback, useRef, useEffect, useState } from "react";
import { useLayerStore } from "@/lib/store/layer-store";
import { SITE_CONFIG } from "@/lib/constants/site";

interface UseMainMapProps {
    items: any[] | null;
    layerType: 'all-countries' | 'country' | 'all-states' | 'state' | 'all-zipcodes' | 'zipcode';
    onMapLoad?: (map: any) => void;
}

export const useMainMap = ({ items, layerType, onMapLoad }: UseMainMapProps) => {
    const { layers, addLayer, isSidebarOpen, toggleSidebar, setSelectedLayer, selectedLayerId } = useLayerStore();
    const mapRef = useRef<any>(null);
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
    const loadedUrlsRef = useRef<Record<string, string>>({});

    const geoJsonData = useMemo(() => {
        if (!items || items.length === 0) return null;

        const baseType = layerType.startsWith('all-')
            ? layerType.slice(4).replace(/ies$/, 'y').replace(/s$/, '')
            : layerType;

        const features = [];
        const len = items.length;
        for (let i = 0; i < len; i++) {
            const item = items[i];
            if (!item.geom_simplified) continue;

            const geom = typeof item.geom_simplified === 'string'
                ? JSON.parse(item.geom_simplified)
                : item.geom_simplified;

            const entityId = `${baseType}:${item.country_code ? item.country_code + ':' : ''}${item.code}`;

            features.push({
                type: "Feature",
                properties: {
                    ...item,
                    entityId,
                    savedLayerType: baseType,
                },
                geometry: geom,
            });
        }

        return {
            type: "FeatureCollection",
            features,
        };
    }, [items, layerType]);

    const layersRef = useRef(layers);
    useEffect(() => {
        layersRef.current = layers;
    }, [layers]);

    const handleMapClick = useCallback((e: any) => {
        if (!geoJsonData) return;
        if (e.features && e.features.length > 0) {
            const clickedFeature = e.features[0];
            const entityId = clickedFeature.properties.entityId;

            const existingLayer = layersRef.current.find(l => l.entityId === entityId);
            if (existingLayer) {
                setSelectedLayer(existingLayer.id);
                if (!isSidebarOpen) toggleSidebar();
                return;
            }

            const entityFeatures = geoJsonData.features.filter(
                (f: any) => f.properties.entityId === entityId
            );

            const props = clickedFeature.properties;

            const style = SITE_CONFIG.map.layerStyles[props.savedLayerType as keyof typeof SITE_CONFIG.map.layerStyles];
            const baseFillColor = style.fillColor;

            addLayer({
                entityId,
                name: props.name || props.code || `Layer ${layersRef.current.length + 1}`,
                type: props.savedLayerType,
                geoJsonData: {
                    type: "FeatureCollection",
                    features: entityFeatures
                },
                fillColor: baseFillColor,
                borderColor: style.borderColor,
                bbox: props.bbox ? (typeof props.bbox === 'string' ? JSON.parse(props.bbox) : props.bbox) : undefined
            });
        }
    }, [geoJsonData, addLayer, isSidebarOpen, toggleSidebar, setSelectedLayer]);

    const currentLayerPaint = useMemo(() => {
        const style = SITE_CONFIG.map.layerStyles[layerType];
        const defaultFillColor = style.fillColor;
        return {
            "fill-color": defaultFillColor,
            "fill-opacity": SITE_CONFIG.map.preview.fillOpacity,
        };
    }, [layerType]);

    const currentBorderPaint = useMemo(() => ({
        "line-color": SITE_CONFIG.map.preview.borderColor,
        "line-width": SITE_CONFIG.map.preview.borderWidth,
        "line-opacity": SITE_CONFIG.map.preview.borderOpacity
    }), []);

    // Manage images for fill patterns
    useEffect(() => {
        if (!mapRef.current) return;
        const map = mapRef.current;

        // Only process layers that have a fillImage
        const layersWithImages = layers.filter(l => l.fillImage);

        layersWithImages.forEach((layer) => {
            const imageId = `image-${layer.id}`;
            const fillImage = layer.fillImage!;
            const isNewImage = loadedUrlsRef.current[imageId] !== fillImage;

            if (!map.hasImage(imageId) || isNewImage) {
                if (map.hasImage(imageId)) {
                    map.removeImage(imageId);
                }

                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.src = fillImage;
                img.onload = () => {
                    if (mapRef.current && map.getStyle()) {
                        if (map.hasImage(imageId)) map.removeImage(imageId);
                        map.addImage(imageId, img);
                        loadedUrlsRef.current[imageId] = fillImage;
                        setLoadedImages(prev => {
                            if (prev.has(imageId) && !isNewImage) return prev;
                            const next = new Set(prev);
                            next.add(imageId);
                            return next;
                        });
                    }
                };
                img.onerror = () => {
                    console.error(`Failed to load image for layer ${layer.id} from URL: ${fillImage}`);
                };
            }
        });

        const currentImageIds = new Set(layersWithImages.map(l => `image-${l.id}`));
        let changed = false;
        const nextLoadedImages = new Set(loadedImages);

        loadedImages.forEach(id => {
            if (!currentImageIds.has(id)) {
                if (map.hasImage(id)) {
                    map.removeImage(id);
                }
                delete loadedUrlsRef.current[id];
                nextLoadedImages.delete(id);
                changed = true;
            }
        });

        if (changed) {
            setLoadedImages(nextLoadedImages);
        }
    }, [layers, loadedImages]);

    useEffect(() => {
        if (selectedLayerId && mapRef.current) {
            const layer = layers.find(l => l.id === selectedLayerId);
            if (layer && layer.bbox) {
                mapRef.current.fitBounds(layer.bbox, {
                    padding: 100,
                    duration: 1500,
                    essential: true
                });
            }
        }
    }, [selectedLayerId, layers]);

    const handleMapLoad = (map: any) => {
        mapRef.current = map;
        if (onMapLoad) onMapLoad(map);
    };

    return {
        layers,
        isSidebarOpen,
        toggleSidebar,
        setSelectedLayer,
        selectedLayerId,
        geoJsonData,
        handleMapClick,
        currentLayerPaint,
        currentBorderPaint,
        loadedImages,
        handleMapLoad,
    };
};
