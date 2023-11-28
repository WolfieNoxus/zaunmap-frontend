// import { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
// import IMap from '../Interfaces/IMap';
// import apiClient from '../services/apiClient';

// async function getFileFromUrl(url: string, filename: string): Promise<File> {
//     const response = await fetch(url);
//     if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const blob = await response.blob();

//     const file = new File([blob], filename, {
//         type: blob.type,
//     });

//     return file;
// }

function Map() {

    const mapId = useLoaderData();
    if (typeof mapId !== "string") {
        throw new Error("Map ID is not a string");
    }
    // const [loading, setLoading] = useState(true);

    // const [ map, setMap ] = useState<IMap>({
    //     _id: "",
    //     name: "",
    //     tags: [],
    //     author: "",
    //     public: false,
    //     object_id: "",
    //     createdAt: "",
    //     updatedAt: "",
    //     likes: 0,
    //     dislikes: 0,
    //     description: "",
    // });

    // const [geojson, setGeojson] = useState<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>({
    //     type: "FeatureCollection",
    //     features: [],
    // });

    // useEffect(() => {
    //     const fetchMapMeta = async (sub: string) => {
    //       try {
    //         const response = await apiClient.get(`/map?_id=${mapId}`);
    //         if (response.status === 200) {
    //           const userData: IMap = response.data;
    //           // console.log("User data retrieved successfully:", userData);
    //           setMap(userData);
    //         } else {
    //           console.error("Failed to retrieve map data");
    //           // Handle errors
    //         }
    //       } catch (err) {
    //         console.error("Error while fetching map data", err);
    //       } finally {
    //         setLoading(false);
    //       }
    //     };
        
    //     fetchMapMeta(mapId);
    //   }, []);

    //   useEffect(() => {
    //     const fetchMapData = async (sub: string) => {
    //       try {
    //         const response = await fetch(`http://zaunmap.pages.dev/${map.author}/${map.object_id}`);
    //         if (response.status === 200) {
    //           const geoJson: GeoJSON.FeatureCollection<GeoJSON.GeometryObject> = await response.json();
    //           setGeojson(geoJson);
    //         } else {
    //           console.error("Failed to retrieve map data");
    //         }

    //       } catch (err) {
    //         console.error("Error while fetching map data", err);
    //       } finally {
    //         setLoading(false);
    //       }
    //     };
        
    //     fetchMapData(mapId);
    //   }, [map]);
    
    return (
        <div>
            Unimplemented Map View. Map ID: {mapId}
        </div>
    );
};

export default Map;