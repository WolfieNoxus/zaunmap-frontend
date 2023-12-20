import { useState, useEffect } from "react";
import apiClient from "../../../services/apiClient";
import { useParams } from 'react-router-dom';
import IMap from "../../../Interfaces/IMap";
import "./css/mapInfo.css";
const MapInfo = () => {
    const { mapId } = useParams<{ mapId: string }>();
    const [mapData, setMapData] = useState<IMap | null>(null);
    useEffect(() => {
        // console.log('Comments component has re-rendered.');
        const fetchMapData = async () => {
          try {
            const response = await apiClient.get(`/map?mapId=${mapId}`);
            // console.log(response.data);
            setMapData(response.data);
          } catch (error) {
            console.error('Error fetching comments', error);
          }
        };
        fetchMapData();
      }, [mapId]);
    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    return (
        <div className="map-info-container">
            <h2 className="map-info-title">Map Info</h2>
            {mapData ? (
                <div className="map-data">
                    <div className="map-detail"><strong>Map Name:</strong> {mapData.name}</div>
                    <div className="map-detail"><strong>Description:</strong> {mapData.description}</div>
                    <div className="map-detail"><strong>Owner:</strong> {mapData.owner}</div>
                    <div className="map-detail"><strong>Created At:</strong> {formatDate(mapData.createdAt)}</div>
                    <div className="map-detail"><strong>Last Updated At:</strong> {formatDate(mapData.updatedAt)}</div>
                    <div className="map-detail"><strong>Public or Private:</strong> {mapData.isPublic ? 'Public' : 'Private'}</div>
                    <div className="map-detail"><strong>Average Rating:</strong> {/* Display stars or progress bar */}</div>
                    <div className="tags">
                        <strong>Tags:</strong>
                        {mapData.tags.map((tag, index) => (
                            <span key={index} className="tag">{tag}</span>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="loading">Loading map data...</p>
            )}
        </div>
    );
};

export default MapInfo;