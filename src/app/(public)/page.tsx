"use client";

import MainMap from "./components/main-map";
import MapLayout from "./components/map-layout";

const App = () => {
  return (
    <MapLayout>
      {({ currentItems, loading, setMapInstance, layerType }) => (
        <MainMap
          items={currentItems}
          loading={loading}
          onMapLoad={setMapInstance}
          layerType={layerType}
        />
      )}
    </MapLayout>
  );
};

export default App;
