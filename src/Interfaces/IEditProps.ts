import IGeoJsonProperties from "./IGeoJsonProperties";
import IMap from "./IMap";
// import { FeatureCollection } from "geojson";

export default interface IEditProps {
  mapProject: IMap;
  onClose: () => void;

  selectedProperties: IGeoJsonProperties;
  setNewProperties: (properties: IGeoJsonProperties) => void;
  setChanged: (changed: boolean) => void;
}
