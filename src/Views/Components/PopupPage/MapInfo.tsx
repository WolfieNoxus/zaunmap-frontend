import { useState, useEffect } from "react";
import apiClient from "../../../services/apiClient";
import { useParams } from "react-router-dom";
import IMap from "../../../Interfaces/IMap";
import ReactStars from "react-rating-stars-component";
import "./css/mapInfo.css";

const MapInfo = () => {
  const { mapId } = useParams<{ mapId: string }>();
  const [mapData, setMapData] = useState<IMap | null>(null);
  const [userName, setUserName] = useState<string>();

  useEffect(() => {
    // console.log('Comments component has re-rendered.');
    const fetchMapData = async () => {
      try {
        const response = await apiClient.get(`/map?mapId=${mapId}`);
        // console.log(response.data);
        setMapData(response.data);
        const username = await getUsername(response.data.owner);
        setUserName(username);
      } catch (error) {
        console.error("Error fetching comments", error);
      }
    };
    fetchMapData();
  }, [mapId]);

  async function getUsername(userId: string): Promise<string> {
    const response = await apiClient.get(`/user?userId=${userId}`);
    return response.data.name;
  }

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const mapMode = (mode: string) => {
    if (mode === "general") {
      return "Freelance Map";
    } else if (mode === "heatmap") {
      return "Heat Map";
    } else if (mode === "colormap") {
      return "Color Map";
    }
  }

  return (
    <div className="map-info-container">
      <h2 className="map-info-title">Map Info</h2>
      {mapData ? (
        <div className="map-data">
          <div className="map-detail">
            <strong>Map Name:</strong> {mapData.name}
          </div>
          <div className="map-detail">
            <strong>Description:</strong> {mapData.description}
          </div>
          <div className="map-detail">
            <strong>Owner:</strong> {userName}
          </div>
          <div className="map-detail">
            <strong>Created At:</strong> {formatDate(mapData.createdAt)}
          </div>
          <div className="map-detail">
            <strong>Last Updated At:</strong> {formatDate(mapData.updatedAt)}
          </div>
          <div className="map-detail">
            <strong>Public or Private:</strong>{" "}
            {mapData.isPublic ? "Public" : "Private"}
          </div>
          <div className="map-detail">
            <strong>Map Mode:</strong>{" "}
            {mapMode(mapData.meta.mode)}
          </div>
          <div className="map-detail">
            <strong>Average Rating:</strong>
            <ReactStars
              count={5}
              size={24}
              activeColor="#ffd700"
              value={mapData.averageRating}
              edit={false}
            />
          </div>

          <strong>Tags:</strong>
          <div className="tags">
            <div className="tag-block">
              {mapData.tags.map((tag, index) => (
                <div key={index} className="tag">
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="loading">Loading map data...</p>
      )}
    </div>
  );
};

export default MapInfo;
