import { useState, useEffect } from 'react';
import MapView from './MapView';
import GeoJSONMapView from './GeoJSONMapView';
import { GeoJsonObject } from 'geojson';
import tj from '@mapbox/togeojson';
import domParser from 'xmldom'; 

type PropsType = {
    fileType: string | null;
    fileData: File | null; 
};

export function MapWrapper({ fileType, fileData }: PropsType) {
    const [geoJSONData, setGeoJSONData] = useState<GeoJsonObject | null>(null);
    
    useEffect(() => {
        // reset state
        setGeoJSONData(null);
        // This will either parse GeoJSON or convert KML/Shapfile to GeoJSON and parse,
        // and then send to GeoJSONMapView to render
        if (fileData) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                if (fileType === "geo.json" || fileType === "geojson" ) {
                    try {
                        const parsedGeoJson = JSON.parse(content);
                        setGeoJSONData(parsedGeoJson);
                    } catch (error) {
                        console.error("Error parsing GeoJSON:", error);
                    }
                } else if (fileType === "kml") {
                    const kmlDocument = new domParser.DOMParser().parseFromString(content, 'text/xml');
                    const convertedGeoJSON = tj.kml(kmlDocument);
                    setGeoJSONData(convertedGeoJSON);
                }
            };
            reader.readAsText(fileData);
        }
    }, [fileType, fileData]);
    // if a file is uploaded, we will call GeoJSONMapView
    if (geoJSONData) {
        return <GeoJSONMapView geoJSONData={geoJSONData} />;
    }
    // default case when no file uploaded
    return <MapView fileData={fileData} />;
}