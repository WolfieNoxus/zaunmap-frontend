import IMap from "./IMap";
import { FeatureCollection } from "geojson";

export default interface IEditProps {
  mapProject: IMap;
  onClose: () => void;

  geojson: FeatureCollection;
  setGeojson: (geojson: FeatureCollection) => void;
}
