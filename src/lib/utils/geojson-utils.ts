/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Normalizes any valid GeoJSON input to a FeatureCollection format
 */
export function normalizeToFeatureCollection(geoJson: any): any {
    if (geoJson.type === "FeatureCollection") {
        return geoJson;
    }

    if (geoJson.type === "Feature") {
        return {
            type: "FeatureCollection",
            features: [geoJson]
        };
    }

    // Assume it's a geometry
    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            geometry: geoJson,
            properties: {}
        }]
    };
}

/**
 * Cleans non-standard properties from GeoJSON features
 */
export function cleanFeatureProperties(features: any[]): any[] {
    return features.map((f: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { geom_simplified: _geom_simplified, geom: _geom, ...restProps } = f.properties || {};
        return {
            ...f,
            properties: restProps
        };
    });
}

/**
 * Calculates bounding box from GeoJSON features
 */
export function calculateBoundingBox(features: any[]): [number, number, number, number] | null {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let hasCoords = false;

    const processCoords = (coords: any) => {
        if (Array.isArray(coords[0])) {
            coords.forEach(processCoords);
        } else if (typeof coords[0] === 'number') {
            minX = Math.min(minX, coords[0]);
            minY = Math.min(minY, coords[1]);
            maxX = Math.max(maxX, coords[0]);
            maxY = Math.max(maxY, coords[1]);
            hasCoords = true;
        }
    };

    features.forEach((f: any) => {
        if (f.geometry && f.geometry.coordinates) {
            processCoords(f.geometry.coordinates);
        }
    });

    return hasCoords ? [minX, minY, maxX, maxY] : null;
}

/**
 * Processes and prepares GeoJSON for layer storage
 */
export function prepareGeoJsonForLayer(geoJson: any): any {
    const normalized = normalizeToFeatureCollection(geoJson);
    const cleanedFeatures = cleanFeatureProperties(normalized.features);

    return {
        ...normalized,
        features: cleanedFeatures
    };
}
