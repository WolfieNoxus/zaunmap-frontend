import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import EditBar from "./Components/Elements/EditBar";
import IMap from "../Interfaces/IMap";
import "./Components/Elements/css/editBar.css";

type TMapViewProps = {
  fileData: File | null;
  onChange: () => void;
};

// interface IMarker {
//   position: [number, number];
//   popup: string;
// }

// const MyComponent = () => {
//   const map = useMapEvents({
//     click: () => {
//       map.locate();
//     },
//     locationfound: (location) => {
//       console.log("location found:", location);
//     },
//   });
//   return null;
// };

const EditMapView: React.FC<TMapViewProps> = ({ fileData, onChange }) => {
  const mapSample: IMap = {
    _id: '1',
    name: "Map Name",
    owner: "John",
    description: "This is a map",
    tags: ["Asia", "Africa", "Europe", "Australia"],
    createdAt: "2021-06-08",
    updatedAt: "2021-06-08",
    isPublic: true,
    averageRating: 0,
    ratingsCount: 0,
    objectId: "1",
    };

  // const markers: IMarker[] = [
  //   {
  //     position: [0, 0],
  //     popup: "Hello",
  //   },
  //   // {
  //   //   position: [40.912690375404175, -73.12368321901101],
  //   //   popup: "New Computer Science Building",
  //   // },
  // ];

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

      {/* {markers.map((marker) => (
        <Marker position={marker.position}>{marker.popup} </Marker>
      ))} */}

      {/* <Marker position={[0,0]}>{} </Marker> */}

      {/* <MyComponent /> */}

      <EditBar mapProject={mapSample} onClose={onChange} />
      {/* {markers.map((marker) => (<p>{marker.position}</p>))} */}
    </div>
  );
};

export default EditMapView;
