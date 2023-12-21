import IRegionStyles, {defaultRegionStyles} from "./IRegionStyles";

export default interface IGeoJsonProperties {
    // ADMIN?: string, 
    ISO_A3?: string,

    name?: string,
    attachText?: string,
    
    // mode?: "general" | "heatmap" | "colormap" ,
    
    // Heat map: color depends on the heatValue of attach
    heatValue?: number,
    // colorHeat?: string,

    // Color map: same tag has same color
    // tagColor?: string,
    // tag?: string,
    // colorLevel?: number,

    styles?: IRegionStyles,

    editId?: number,
}

export const defaultGeoJsonProperties: IGeoJsonProperties = {
    name: "",
    editId: -1,
    attachText: "",
    styles: defaultRegionStyles,
}