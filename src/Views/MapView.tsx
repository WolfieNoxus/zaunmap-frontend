import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { RiCommunityLine } from "react-icons/ri";
import { BiSearch } from "react-icons/bi";
import "leaflet/dist/leaflet.css";

type TMapViewProps = {
  fileData: File | null;
};

const MapView: React.FC<TMapViewProps> = ({ fileData }) => {
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
        <ZoomControl position="bottomleft" />
      </MapContainer>
      {/* <CustomComponent /> */}
      <RiCommunityLine className="custom-left" size={30} />
      <BiSearch className="custom-right" size={30} />

      {/* <div id="map-portal"></div>
        {ReactDOM.createPortal(
          <RiCommunityLine />,
          document.getElementById("map-portal")
        )} */}
    </div>
  );
};

export default MapView;
