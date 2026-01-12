"use client";

import MainMap from "./components/main-map";
import MapLayout from "./components/map-layout";

const App = () => {
  return (
    <MapLayout>
      {({ setMapInstance }) => (
        <MainMap
          loading={false}
          onMapLoad={setMapInstance}
        />
      )}
    </MapLayout>
  );
};

export default App;
