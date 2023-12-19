import IGeoJsonProperties from "./IGeoJsonProperties";
import IMap from "./IMap";
// import { FeatureCollection } from "geojson";

export default interface IEditProps {
  mapProject: IMap;
  onClose: () => void;

  selectedProperties: IGeoJsonProperties;
  setSelectedProperties: (properties: IGeoJsonProperties) => void;
}
