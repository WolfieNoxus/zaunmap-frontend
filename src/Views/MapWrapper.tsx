import { useState, useEffect } from 'react';
import MapView from './MapView';
import GeoJSONMapView from './GeoJSONMapView';
import { GeoJsonObject } from 'geojson';
import tj from '@mapbox/togeojson';
import domParser from 'xmldom';
import shp from 'shpjs';
import JSZip from 'jszip';

type TPropsType = {
    fileType: string | null;
    fileData: File | null; 
};

export function MapWrapper({ fileType, fileData }: TPropsType) {
    const [geoJSONData, setGeoJSONData] = useState<GeoJsonObject[] | null>(null)
    useEffect(() => {
        // reset state
        setGeoJSONData(null);
        if (fileData) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const content = e.target?.result;
                // handle geojson file
                if (fileType === "geo.json" || fileType === "geojson" ) {
                    try {
                        const parsedGeoJson = JSON.parse(content as string);
                        const geoJsonArray: GeoJsonObject[] = [parsedGeoJson];
                        setGeoJSONData(geoJsonArray);
                    } catch (error) {
                        console.error("Error parsing GeoJSON:", error);
                    }
                }
                // handle kml file 
                else if (fileType === "kml") {
                    const kmlDocument = new domParser.DOMParser().parseFromString(content as string, 'text/xml');
                    const convertedGeoJSON = tj.kml(kmlDocument);
                    const geoJsonArray: GeoJsonObject[] = [convertedGeoJSON];
                    setGeoJSONData(geoJsonArray);
                } 
                // handle shapefile
                else if (fileType === "zip") {  
                    const jszip = new JSZip();
                    const zip = await jszip.loadAsync(fileData);
                    // Group files by their basename
                    let groupedFiles: { [key: string]: { [key: string]: JSZip.JSZipObject } } = {};
                    zip.forEach((relativePath, zipEntry) => {
                        const basename = relativePath.split('.').slice(0, -1).join('.');
                        if (!groupedFiles[basename]) {
                            groupedFiles[basename] = {};
                        }
                        const ext = (relativePath.split('.').pop() ?? "").toLowerCase();
                        groupedFiles[basename][ext] = zipEntry;
                    });
                    // Extract and parse all the shp and dbf files
                    let geojsonDatas : GeoJsonObject[] = [];
                    for (let basename in groupedFiles) {
                        if (groupedFiles[basename].shp && groupedFiles[basename].dbf) {
                            const shpBuffer = await groupedFiles[basename].shp.async('arraybuffer');
                            const dbfBuffer = await groupedFiles[basename].dbf.async('arraybuffer');
                            const prjBuffer = groupedFiles[basename].prj ? await groupedFiles[basename].prj.async('text') : null;
                            
                            const geojsonData = shp.combine([
                                shp.parseShp(shpBuffer, prjBuffer),
                                shp.parseDbf(dbfBuffer)
                            ]);
                            geojsonDatas.push(geojsonData);
                        }
                    }
                    setGeoJSONData(geojsonDatas);
                }
            };
            reader.readAsText(fileData);
        
        }
    }, [fileType, fileData]);

    if (geoJSONData) {
        return <GeoJSONMapView geoJSONData={geoJSONData} />;
    }

    return <MapView fileData={fileData} />;
}