import { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import GeomanWrapper from '../Views/MapEditor';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import IMap from '../Interfaces/IMap';
import apiClient from '../services/apiClient';
import fileClient from '../services/fileClient';

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
    const [loading, setLoading] = useState(true);

    const [map, setMap] = useState<IMap>({
        _id: "",
        name: "",
        tags: [],
        owner: "",
        isPublic: false,
        objectId: "",
        createdAt: "",
        updatedAt: "",
        averageRating: 0,
        ratingsCount: 0,
        description: "",
    });

    const [geojson, setGeojson] = useState<GeoJSON.FeatureCollection<GeoJSON.GeometryObject>>({
        type: "FeatureCollection",
        features: [],
    });

    useEffect(() => {
        const fetchMapMeta = async (sub: string) => {
            try {
                const response = await apiClient.get(`/map?mapId=${mapId}`);
                if (response.status === 200) {
                    const userData: IMap = response.data;
                    // console.log("User data retrieved successfully:", userData);
                    setMap(userData);
                } else {
                    console.error("Failed to retrieve map data");
                    // Handle errors
                }
            } catch (err) {
                console.error("Error while fetching map data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMapMeta(mapId);
    }, [mapId]);

    useEffect(() => {
        const fetchMapData = async (sub: IMap) => {
            try {
                const response = await fileClient.get(`?user_id=${sub.owner}&object_id=${sub.objectId}`);
                if (response.status === 200) {
                    const geoJson: GeoJSON.FeatureCollection<GeoJSON.GeometryObject> = response.data;
                    setGeojson(geoJson);
                } else {
                    console.error("Failed to retrieve map data");
                }

            } catch (err) {
                console.error("Error while fetching map data", err);
            } finally {
                setLoading(false);
            }
        };

        if (map.owner && map.objectId) {
            fetchMapData(map);
        }
    }, [map]);

    useEffect(() => {
        const putMapData = async (sub: IMap, geojson: GeoJSON.FeatureCollection<GeoJSON.GeometryObject>) => {
            try {
                const response = await fileClient.put(`?user_id=${sub.owner}&object_id=${sub.objectId}`, geojson, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                if (response.status === 200) {
                    console.log("Successfully updated map data");
                } else {
                    console.error("Failed to update map data");
                }
            } catch (err) {
                console.error("Error while updating map data", err);
            }
        };

        if (map.owner && map.objectId) {
            putMapData(map, geojson);
        };
        // eslint-disable-next-line
    }, [geojson]);

    if (loading) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }
    return (
        <div>
            <MapContainer
                className="structure-of-map"
                center={[0, 0]}
                zoom={4}
                minZoom={1}
                maxBounds={[
                    [-90, -180],
                    [90, 180],
                ]}
                maxBoundsViscosity={1}
                zoomControl={false}
            >
                <TileLayer
                    attribution="Map data <a href='https://www.openstreetmap.org'>OpenStreetMap</a> contributors"
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
                />
                <GeomanWrapper geojson={geojson} setGeojson={setGeojson} />
                <ZoomControl position="bottomleft" />
            </MapContainer>
        </div>
    );
};

export default Map;