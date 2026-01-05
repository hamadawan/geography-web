/* eslint-disable @typescript-eslint/no-explicit-any */
import { SITE_CONFIG } from "../constants/site";
import { Layer } from "../store/layer-store";

export const exportLayersToGeoJSON = (layers: Layer[]): string => {
    const featureCollection = {
        type: "FeatureCollection",
        features: layers.map((layer) => {
            const data = layer.geoJsonData as any;
            let feature: any;

            if (data.type === "Feature") {
                feature = { ...data };
            } else if (data.type === "FeatureCollection") {
                feature = data.features[0] || { type: "Feature", geometry: null, properties: {} };
            } else {
                feature = {
                    type: "Feature",
                    geometry: data,
                    properties: {},
                };
            }

            // Ensure properties exists
            feature.properties = feature.properties || {};

            // Clean up non-standard properties from the source data if they exist
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { geom_simplified: _geom_simplified, geom: _geom, entityId: _entityId, savedLayerType: _savedLayerType, ...cleanProps } = feature.properties;

            // Inject our custom properties with gc: prefix
            feature.properties = {
                ...cleanProps,
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
                // Standard GeoJSON styling properties for compatibility
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
    if (!geoJson) {
        throw new Error("Invalid GeoJSON: Input is null or undefined");
    }

    let features: any[] = [];
    if (geoJson.type === "FeatureCollection" && Array.isArray(geoJson.features)) {
        features = geoJson.features;
    } else if (geoJson.type === "Feature") {
        features = [geoJson];
    } else if (geoJson.type && ["Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon", "GeometryCollection"].includes(geoJson.type)) {
        features = [{ type: "Feature", geometry: geoJson, properties: {} }];
    } else {
        throw new Error("Invalid GeoJSON: Expected a FeatureCollection, Feature, or Geometry");
    }

    return features.map((feature: any) => {
        const props = feature.properties || {};
        const layerType = (props["gc:type"] || "country") as keyof typeof SITE_CONFIG.map.layerStyles;
        const style = SITE_CONFIG.map.layerStyles[layerType] || SITE_CONFIG.map.layerStyles.country;

        return {
            name: props["gc:name"] || props.name || "Imported Layer",
            type: props["gc:type"] || "country",
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
