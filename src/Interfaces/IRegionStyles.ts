export default interface IRegionStyles {
  stroke?: boolean;
  color?: string;
  weight?: number;
  opacity?: number;
  lineCap?: string;
  lineJoin?: string;
  dashArray?: string | null;
  dashOffset?: string | null;
  fill?: boolean;
  fillColor?: string;
  fillOpacity?: number;
  fillRule?: string;
  bubblingMouseEvents?: boolean;
  className?: string | null;
}

export const defaultRegionStyles: IRegionStyles = {
  stroke: true,
  color: "#3388ff",
  weight: 3,
  opacity: 1.0,
  lineCap: "round",
  lineJoin: "round",
  dashArray: null,
  dashOffset: null,
  fill : true, // Adjust the default as needed
  fillColor: "#3388ff",
  fillOpacity: 0.2,
  fillRule: "evenodd",
  bubblingMouseEvents: true,
  // renderer, // No default provided
  className: null,
};
