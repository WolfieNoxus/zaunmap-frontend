import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import EditBar from "./Components/Elements/EditBar";
import IMapProject from "./Components/PopupPage/Interfaces/IMapProject";
import "./Components/Elements/css/editBar.css";

type TMapViewProps = {
  fileData: File | null;
  onChange: () => void;
};

const EditMapView: React.FC<TMapViewProps> = ({ fileData, onChange }) => {
  const mapSample: IMapProject = {
    id: 1,
    projecName: "Map Name",
    description: "This is a map",
    tags: ["Asia", "Africa", "Europe", "Australia"],
    createTime: "2021-06-08",
    lastEditTime: "2021-06-08",
    viewPublic: true,
    view: 12,
    like: 133,
    comments: [
      {
        id: 1,
        userName: "John",
        comment: "Hello, This is a comment!",
        date: "2021-06-08",
        like: true,
      },
      {
        id: 2,
        userName: "Jane",
        comment: "Hi",
        date: "2021-06-08",
        like: false,
      },
    ],
    attach: [
      { attachText: "Asia", regionColor: "#F8E431", textColor: "#4B4F5D" },
      { attachText: "Austraila", regionColor: "#02994C", textColor: "#4B4F5D" },
      { attachText: "Europe", regionColor: "#0182C7", textColor: "#4B4F5D" },
      { attachText: "America", regionColor: "#E93753", textColor: "#4B4F5D" },
      { attachText: "Africa", regionColor: "#4B4F5D", textColor: "#4B4F5D" },
    ],
  };

  return (
    <div>
      <MapContainer
        className="structure-of-map"
        center={[0, 0]}
        zoom={4}
        minZoom={1}
        maxBoundsViscosity={1}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>

      <EditBar mapProject={mapSample} onClose={onChange} />
    </div>
  );
};

export default EditMapView;
