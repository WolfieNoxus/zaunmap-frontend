export default interface IMeta {
  mode: "general" | "heatmap" | "colormap";

  // heat map
  colorHeat?: string;
  heatLevel?: number;
  heatValueMin?: number;
  heatValueMax?: number;

  // color map
  colorLevel?: number;
  colorTag?: IColorTag[];
}

export interface IColorTag {
  tag: string;
  color: string;
}

export const defaultMeta: IMeta = {
  mode: "general",

  colorHeat: "#ff0000",
  heatLevel: 5,
  heatValueMin: 0,
  heatValueMax: 100,

  colorLevel: 10,
  colorTag: [],
};
