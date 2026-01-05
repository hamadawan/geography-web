import { SITE_CONFIG } from "../constants/site";
import { Layer } from "../store/layer-store";

export const exportLayersToGeoJSON = (layers: Layer[]): string => {
    // ... (rest of export function remains same)
    const featureCollection = {
        type: "FeatureCollection",
        features: layers.map((layer) => {
            // If geoJsonData is already a FeatureCollection, we might need to handle it differently
            // but usually it's a single Feature or Geometry.
            // Let's assume we want to wrap it into a Feature if it's just geometry.

            const data = layer.geoJsonData as any;
            let feature: any;

            if (data.type === "Feature") {
                feature = { ...data };
            } else if (data.type === "FeatureCollection") {
                // If it's a collection, we take the first feature or merge them?
                // For our app, layers usually correspond to one entity (country/state/zip).
                feature = data.features[0] || { type: "Feature", geometry: null, properties: {} };
            } else {
                // Assume it's a geometry
                feature = {
                    type: "Feature",
                    geometry: data,
                    properties: {},
                };
            }

            // Inject our custom properties
            feature.properties = {
                ...feature.properties,
                "gc:name": layer.name,
                "gc:type": layer.type,
                "gc:fillColor": layer.fillColor,
                "gc:fillOpacity": layer.fillOpacity,
                "gc:borderColor": layer.borderColor,
                "gc:borderOpacity": layer.borderOpacity,
                "gc:borderWidth": layer.borderWidth,
                "gc:borderStyle": layer.borderStyle,
                "gc:entityId": layer.entityId,
                "gc:bbox": layer.bbox,
                "gc:fillImage": layer.fillImage,
                // Standard GeoJSON styling properties (optional but good for compatibility)
                fill: layer.fillColor,
                stroke: layer.borderColor,
                "fill-opacity": layer.fillOpacity,
                "stroke-opacity": layer.borderOpacity,
                "stroke-width": layer.borderWidth,
            };

            // Also set bbox at the feature level if available
            if (layer.bbox) {
                feature.bbox = layer.bbox;
            }

            return feature;
        }),
    };

    return JSON.stringify(featureCollection, null, 2);
};

export const importLayersFromGeoJSON = (geoJson: any): Omit<Layer, "id" | "visible">[] => {
    if (!geoJson || geoJson.type !== "FeatureCollection" || !Array.isArray(geoJson.features)) {
        throw new Error("Invalid GeoJSON: Expected a FeatureCollection");
    }

    return geoJson.features.map((feature: any) => {
        const props = feature.properties || {};
        const layerType = (props["gc:type"] || "country") as keyof typeof SITE_CONFIG.map.layerStyles;
        const style = SITE_CONFIG.map.layerStyles[layerType] || SITE_CONFIG.map.layerStyles.country;

        return {
            name: props["gc:name"] || props.name || "Imported Layer",
            type: props["gc:type"] || "country", // Default to country if unknown
            entityId: props["gc:entityId"],
            geoJsonData: {
                type: "Feature",
                geometry: feature.geometry,
                properties: props,
            },
            fillColor: props["gc:fillColor"] || props.fill || style.fillColor,
            fillOpacity: props["gc:fillOpacity"] !== undefined ? props["gc:fillOpacity"] : (props["fill-opacity"] !== undefined ? props["fill-opacity"] : style.fillOpacity),
            borderColor: props["gc:borderColor"] || props.stroke || style.borderColor,
            borderOpacity: props["gc:borderOpacity"] !== undefined ? props["gc:borderOpacity"] : (props["stroke-opacity"] !== undefined ? props["stroke-opacity"] : style.borderOpacity),
            borderWidth: props["gc:borderWidth"] !== undefined ? props["gc:borderWidth"] : (props["stroke-width"] !== undefined ? props["stroke-width"] : style.borderWidth),
            borderStyle: props["gc:borderStyle"] || style.borderStyle,
            bbox: props["gc:bbox"] || feature.bbox || props.bbox,
            fillImage: props["gc:fillImage"] || style.fillImage,
        };
    });
};
