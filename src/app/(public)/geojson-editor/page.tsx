"use client";

import MainMap from "../components/main-map";
import MapLayout from "../components/map-layout";
import { GeoJSONEditor } from "../components/geojson-editor";
import maplibre from "maplibre-gl";

const GeoJSONEditorPage = () => {

    const handleFitBounds = (bbox: [number, number, number, number], mapInstance: maplibre.Map | null) => {
        if (mapInstance) {
            mapInstance.fitBounds(bbox, {
                padding: 50,
                duration: 1000,
                essential: true,
            });
        }
    };

    return (
        <MapLayout>
            {({ currentItems, loading, mapInstance, setMapInstance, layerType }) => (
                <div className="flex-1 flex overflow-hidden">
                    <MainMap
                        items={currentItems}
                        loading={loading}
                        onMapLoad={setMapInstance}
                        layerType={layerType}
                        className="flex-1"
                        rightSidebarWidth={450}
                    />
                    <GeoJSONEditor
                        onFitBounds={(bbox) => handleFitBounds(bbox, mapInstance)}
                    />
                </div>
            )}
        </MapLayout>
    );
};

export default GeoJSONEditorPage;
