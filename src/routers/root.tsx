import { useState } from "react";
import FileLoaderView from "../Views/FileLoaderView";

import '../css/root.css';

function Root() {

  const [geoPackage, setGeoPackage] = useState<File>();

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
    <FileLoaderView setGeoPackage={(geoPackage: File) => setGeoPackage(geoPackage)}>
    </FileLoaderView>
  );
}

export default Root;
