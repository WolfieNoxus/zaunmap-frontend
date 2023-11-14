import { MapContainer, TileLayer, GeoJSON, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { GeoJsonObject } from "geojson";
import { useState } from "react";
import Popup from "./Components/Popup";

// Icons Part
// import TopLeft from "./Components/TopLeft";
// import TopRight from "./Components/TopRight";
// import BottomRight from "./Components/BottomRight";
// import BottomLeft from "./Components/BottomLeft";

// Icons Button
import { RiCommunityLine } from "react-icons/ri"; // TopLeft
import { BiSolidUserCircle } from "react-icons/bi"; // TopRight
import { BiInfoCircle } from "react-icons/bi"; // BottomLeft
import { MdAddCircle, MdChatBubbleOutline } from "react-icons/md"; // BottomRight

type TGeoJSONMapViewProps = {
  geoJSONData: GeoJsonObject[];
};

const GeoJSONMapView: React.FC<TGeoJSONMapViewProps> = ({ geoJSONData }) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupPage, setPopupPage] = useState<
    | "community"
    | "userProfile"
    | "comments"
    | "mapInfo"
    | "logIn"
    | "signUp"
    | "forgotPassword"
  >("community");

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
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {geoJSONData.map((geoJsonObject, index) => (
          <GeoJSON key={index} data={geoJsonObject} />
        ))}
        <ZoomControl position="bottomleft" />
      </MapContainer>

      
    </div>
  );
};

export default GeoJSONMapView;
