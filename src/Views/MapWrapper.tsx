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
                const content =  e.target?.result;
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
                else if (fileType === "zip" || fileType === "shp") { 
                    let zip;
                    // When the file uploaded is a single shp file, we will convert it to zip
                    // and then parse the zip and parse to geojson
                    if (fileType === "shp") {
                        const shpToZip = new JSZip();
                        shpToZip.file(fileData.name, fileData);
                        const zipFile = await shpToZip.generateAsync({ type: "arraybuffer" });
                        zip = await new JSZip().loadAsync(zipFile);
                    }
                    // this will when the uploaded file is a zip 
                    else {
                        zip = await new JSZip().loadAsync(fileData);
                    }
                    // Group files by their pairname
                    let groupedFiles: { [key: string]: { [key: string]: JSZip.JSZipObject } } = {};

                    zip.forEach((relativePath, zipEntry) => {
                        const pairname = relativePath.split('.').slice(0, -1).join('.');
                        if (!groupedFiles[pairname]) {
                            groupedFiles[pairname] = {};
                        }
                        const ext = (relativePath.split('.').pop() ?? "").toLowerCase();
                        groupedFiles[pairname][ext] = zipEntry;
                    });
                    let geojsonDatas: GeoJsonObject[] = [];
                    for (let pairname in groupedFiles) {
                        // If both .shp and .dbf are present, proceed with parsing
                        if (groupedFiles[pairname].shp && groupedFiles[pairname].dbf) {
                            const shpBuffer = await groupedFiles[pairname].shp.async('arraybuffer');
                            const dbfBuffer = await groupedFiles[pairname].dbf.async('arraybuffer');
                            const prjBuffer = groupedFiles[pairname].prj ? await groupedFiles[pairname].prj.async('text') : null;
                            
                            const geojsonData = shp.combine([
                                shp.parseShp(shpBuffer, prjBuffer),
                                shp.parseDbf(dbfBuffer)
                            ]);
                            geojsonDatas.push(geojsonData);
                        }
                        // If only .shp is present 
                        else if (groupedFiles[pairname].shp) {
                            const shpBuffer = await groupedFiles[pairname].shp.async('arraybuffer');
                            const geojsonData = shp.parseShp(shpBuffer);
                            geojsonDatas.push(geojsonData);
                        } 
                        else {
                            console.warn(`File set for basename: ${pairname} is missing required components.`);
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