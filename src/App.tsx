import { useState } from "react";
import { GeoPackage } from '@ngageoint/geopackage';
import FileLoaderView from "./Views/FileLoaderView";

import './App.css';

function App() {

  const [geoPackage, setGeoPackage] = useState<GeoPackage>();

  /**
   * THIS FUNCTION IS ONLY USE TO SUPPRESS THE TS ERROR.
   * PLEASE REMOVE THIS FUNCTION WHEN ALL VARS ARE USED.
   */
  function handleUnusedVars() {
    if (geoPackage) {
      console.log(geoPackage);
    }
  }
  handleUnusedVars();

  return (
    <FileLoaderView setGeoPackage={(geoPackage: GeoPackage) => setGeoPackage(geoPackage)}>
    </FileLoaderView>
  );
}

export default App;
