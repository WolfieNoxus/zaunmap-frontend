import IGeoJsonProperties from "./IGeoJsonProperties";
import IMap from "./IMap";
import IMeta from "./IMeta";
// import { FeatureCollection } from "geojson";

export default interface IEditProps {
  mapProject: IMap;
  onClose: () => void;

  selectedProperties: IGeoJsonProperties;
  setNewProperties: (properties: IGeoJsonProperties) => void;
  // setNewMeta: (meta: IMeta) => void;
  setChanged: (changed: boolean) => void;
}