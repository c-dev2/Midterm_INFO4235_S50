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

import React from 'react';
import { createRoot } from "react-dom/client";
import {APIProvider} from '@vis.gl/react-google-maps';

// According to Vite docs (https://vitejs.dev/guide/env-and-mode.html#env-files), ENV variables are called like 
// they are below, with import.meta.env.VITE_ENV_VAR. Ignore error being thrown by IDE.
const App = () => (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
        <h1>Hello, world!</h1>
    </APIProvider>
);

// Attaches code from above "App" const to the root of the DOM. This is basically just another way to render
// a React app as the code below attaches the "App" code above to the HTML document which calls it and populates
// the HTML with the code above.
const root = createRoot(document.getElementById('app'));
root.render(<App />);

export default App;