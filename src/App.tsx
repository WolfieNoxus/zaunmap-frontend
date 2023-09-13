import { useState } from "react";
import { GeoPackage } from '@ngageoint/geopackage';
import FileLoaderView from "./Views/FileLoaderView";

import './App.css';

function App() {

  const [geoPackage, setGeoPackage] = useState<GeoPackage>();

  return (
    <FileLoaderView setGeoPackage={(geoPackage: GeoPackage) => setGeoPackage(geoPackage)}>
    </FileLoaderView>
  );
}

export default App;
