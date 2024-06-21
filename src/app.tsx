/**
 * Copyright 2024 Google LLC
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    https://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// Code acquired from Google documentation: https://developers.google.com/codelabs/maps-platform/maps-platform-101-react-js#0
// License/copyright notice retained above even though this file has been modified by me.

import React, {useState, useEffect} from 'react';
import { createRoot } from "react-dom/client";
import {APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef} from '@vis.gl/react-google-maps';

// Below function uses HTML built-in geolocation feature to get user's position, then return the latitude
// and longitude of user's location as an object.
function getUserPos() {
    // Set default position to Science World
    const [userPos, setUserPos] = useState({lat: 49.27419524703112, lng: -123.10334230846034});
    if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
        const userLoc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
        };

        setUserPos(userLoc);

        console.log(userPos);
    });
}

return userPos;
}

// Below function determines distance between the location object that's passed through and the KPU Surrey Library
// Location object must have same fields as above userPos object {lat, lng}
// Formula for distance between two points acquired from https://www.omnicalculator.com/other/latitude-longitude-distance
// Formula is: d = 2R × sin⁻¹(√[sin²((θ₂ - θ₁)/2) + cosθ₁ × cosθ₂ × sin²((φ₂ - φ₁)/2)])
// Where R = 6371 km (Earth's radius), θ₁ φ₁ is the first location's lat and long, and θ₂ φ₂ is the lat and long of point 2
// Code reference: https://mapsplatform.google.com/resources/blog/how-calculate-distances-map-maps-javascript-api/
function getKPUDist(loc) {
    const KPULibPos = {lat: 49.13244672377832, lng: -122.8712181425452};
    const R = 6371;

    let KPULibLat = KPULibPos.lat * (Math.PI/180); // convert to radians for calculation
    let KPULibLng = KPULibPos.lng * (Math.PI/180); // convert to radians for calculation
    let userLat = loc.lat * (Math.PI/180); // convert to radians for calculation
    let userLng = loc.lng * (Math.PI/180); // convert to radians for calculation

    // Get differences of latitudes and longitudes
    let latDiff = KPULibLat - userLat;
    let lngDiff = KPULibLng - userLng;

    // Perform the actual calculation based on the above formula, then return the result to 2 decimal places
    let d = 2 * R * Math.asin(Math.sqrt(Math.sin(latDiff/2)*Math.sin(latDiff/2)+Math.cos(userLat)*Math.cos(KPULibLat)*Math.sin(lngDiff/2)*Math.sin(lngDiff/2)));
    return d.toFixed(2);
}

// Below code taken from https://visgl.github.io/react-google-maps/docs/api-reference/components/advanced-marker and modified
// Generates a customizable marker and window pop-up
const MarkerWithInfoWindow = props => {
    const [markerRef, marker] = useAdvancedMarkerRef();
  
    return (
        <AdvancedMarker position={getUserPos()} ref={markerRef}>
            <Pin background={'#7abfe9'} glyphColor={'#000'} borderColor={'#000'} scale={0.75} />
            <InfoWindow anchor={marker} headerDisabled={true}>
                <p>{getKPUDist(getUserPos())} km away from KPU Surrey Library</p>
            </InfoWindow>
        </AdvancedMarker>
    );
  };

const App = () => (
    // According to Vite docs (https://vitejs.dev/guide/env-and-mode.html#env-files), ENV variables are called like 
    // they are below, with import.meta.env.VITE_ENV_VAR. Ignore error being thrown by IDE.
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
        <Map 
        mapId={import.meta.env.VITE_MAP_ID}
        defaultZoom={15}
        center={getUserPos()}
        >
            <MarkerWithInfoWindow></MarkerWithInfoWindow>
        </Map>
    </APIProvider>
);

// Attaches code from above "App" const to the root of the DOM. This is basically just another way to render
// a React app as the code below attaches the "App" code above to the HTML document which calls it and populates
// the HTML with the code above.
const root = createRoot(document.getElementById('app'));
root.render(<App />);

export default App;
