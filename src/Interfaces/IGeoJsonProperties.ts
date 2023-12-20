import IRegionStyles, {defaultRegionStyles} from "./IRegionStyles";

export default interface IGeoJsonProperties {
    // ADMIN?: string, 
    ISO_A3?: string,

    name?: string,
    density?: number,

    mode?: "general" | "heatmap" ,

    styles?: IRegionStyles,

    editId?: number,
}

export const defaultGeoJsonProperties: IGeoJsonProperties = {
    name: "",
    density: 0,
    styles: defaultRegionStyles,
}