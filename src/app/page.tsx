"use client"

import React, { FC } from 'react';
import Map from '@/components/map';
import Layer from '@/components/map/layer';
import Marker from '@/components/map/marker';

const geoJsonData: GeoJSON.FeatureCollection = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -97.60330078860761,
              38.28943896611448
            ],
            [
              -97.79814920266992,
              38.28176662383246
            ],
            [
              -97.9910008616227,
              38.258828321565986
            ],
            [
              -98.1798833251041,
              38.22085926596763
            ],
            [
              -98.36287230898228,
              38.168248264045516
            ],
            [
              -98.53811459844755,
              38.10153298463153
            ],
            [
              -98.70384961268411,
              38.02139345676803
            ],
            [
              -98.85842925088308,
              37.92864393091023
            ],
            [
              -99.00033571072602,
              37.82422325612525
            ],
            [
              -99.12819703971795,
              37.70918394806137
            ],
            [
              -99.24080025292133,
              37.58468013791413
            ],
            [
              -99.33710192384963,
              37.45195460184267
            ],
            [
              -99.41623622497467,
              37.31232507354007
            ],
            [
              -99.47752045751878,
              37.16717004046904
            ],
            [
              -99.52045816469564,
              37.017914217394
            ],
            [
              -99.5447399668871,
              36.86601388016465
            ],
            [
              -99.55024229072714,
              36.71294222919565
            ],
            [
              -99.53702418676713,
              36.56017493669413
            ],
            [
              -99.50532244296026,
              36.409176015303295
            ],
            [
              -99.45554520473661,
              36.261384129235225
            ],
            [
              -99.38826430833953,
              36.11819945280665
            ],
            [
              -99.30420652392158,
              35.980971166059135
            ],
            [
              -99.20424389023142,
              35.850985663185675
            ],
            [
              -99.08938330507043,
              35.72945553700148
            ],
            [
              -98.96075551640917,
              35.61750939176838
            ],
            [
              -98.81960363928074,
              35.51618252729129
            ],
            [
              -98.66727130424071,
              35.42640852925554
            ],
            [
              -98.50519052500569,
              35.34901179412061
            ],
            [
              -98.33486935635291,
              35.28470101135082
            ],
            [
              -98.1578793987961,
              35.23406362116117
            ],
            [
              -97.97584319411688,
              35.1975612621026
            ],
            [
              -97.79042154558319,
              35.17552621953588
            ],
            [
              -97.60330078860761,
              35.168158883199396
            ],
            [
              -97.41618003163205,
              35.17552621953588
            ],
            [
              -97.23075838309835,
              35.1975612621026
            ],
            [
              -97.04872217841913,
              35.23406362116117
            ],
            [
              -96.8717322208623,
              35.28470101135082
            ],
            [
              -96.70141105220954,
              35.34901179412061
            ],
            [
              -96.53933027297451,
              35.42640852925554
            ],
            [
              -96.38699793793447,
              35.51618252729129
            ],
            [
              -96.24584606080606,
              35.61750939176838
            ],
            [
              -96.11721827214478,
              35.72945553700148
            ],
            [
              -96.0023576869838,
              35.850985663185675
            ],
            [
              -95.90239505329363,
              35.980971166059135
            ],
            [
              -95.8183372688757,
              36.11819945280665
            ],
            [
              -95.75105637247862,
              36.261384129235225
            ],
            [
              -95.70127913425495,
              36.409176015303295
            ],
            [
              -95.6695773904481,
              36.56017493669413
            ],
            [
              -95.65635928648808,
              36.71294222919565
            ],
            [
              -95.66186161032815,
              36.86601388016465
            ],
            [
              -95.68614341251957,
              37.017914217394
            ],
            [
              -95.72908111969645,
              37.16717004046904
            ],
            [
              -95.79036535224054,
              37.31232507354007
            ],
            [
              -95.86949965336561,
              37.45195460184267
            ],
            [
              -95.96580132429389,
              37.58468013791413
            ],
            [
              -96.07840453749726,
              37.70918394806137
            ],
            [
              -96.2062658664892,
              37.82422325612525
            ],
            [
              -96.34817232633215,
              37.92864393091023
            ],
            [
              -96.5027519645311,
              38.02139345676803
            ],
            [
              -96.66848697876766,
              38.10153298463153
            ],
            [
              -96.84372926823293,
              38.168248264045516
            ],
            [
              -97.02671825211114,
              38.22085926596763
            ],
            [
              -97.21560071559253,
              38.258828321565986
            ],
            [
              -97.4084523745453,
              38.28176662383246
            ],
            [
              -97.60330078860761,
              38.28943896611448
            ]
          ]
        ]
      }
    }
  ]
};

const App = () => {
  const handleMapLoad = (map) => {
    console.log(map, 'here')
  }

  return (
    <Map
      containerClass='h-screen w-screen'
      zoom={10}
      center={[-97.8, 38.3]}
      onLoad={handleMapLoad}
    >
      <Layer
        layerId="geojson-layer-1"
        geoJsonData={geoJsonData}
        paint={{
          'fill-color': '#00f',
          'fill-opacity': 0.4,
        }}
      />
      <Layer
        layerId="geojson-layer-2"
        geoJsonData={geoJsonData}
        paint={{
          'fill-color': '#f00',
          'fill-opacity': 0.4,
        }}
      />
      <Marker position={[-97.8, 38.3]}>
        <div style={{ background: 'black', padding: '10px', borderRadius: '8px', zIndex: "9999" }}>
          <h3>Overlay Title</h3>
          <p>This is custom overlay content.</p>
        </div>
      </Marker>

      <Marker position={[-97.8, 38.3]}>
        <div style={{ background: 'black', padding: '10px', borderRadius: '8px', zIndex: "9999" }}>
          <h3>Overlay Title</h3>
          <p>This is custom overlay content.</p>
        </div>
      </Marker>
    </Map>
  );
};

export default App;
