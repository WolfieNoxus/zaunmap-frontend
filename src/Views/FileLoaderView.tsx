import { useRef, useState} from 'react';
import GeoJSONMapDisplay from './GeoJSONMapDisplay';
import '../css/FileLoader.css';

export default function FileLoaderView({ children, setGeoPackage }: { children: any, setGeoPackage: (geoPackage: File) => void }) {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [geoJsonData, setGeoJSON] = useState<any>(null);
    /**
     * Handle File Load / Change, Send to Controller for Conversion
     * 
     * @param event: React.ChangeEvent<HTMLInputElement>
     * 
     * @returns void
     */
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        // For now, it only consists the parsing of the GeoJSON file into readable data,
        // And then pass into the geoJsonData, which will trigger the MapDisplay
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const content = e.target?.result;
                try {
                    const parsedGeoJson = JSON.parse(content as string);
                    setGeoJSON(parsedGeoJson)
                }catch (error) {
                    console.error("Error parsing GeoJSON:", error);
                }
            };
            reader.readAsText(file);
        }
        else {
            throw new Error("File not found!");
        }
    };

    const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    /**
     * Handle File Drop, Send to Controller for Conversion
     * 
     * @param event: React.DragEvent<HTMLDivElement>
     * 
     * @returns void
     */
    const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (event.dataTransfer) {
            const file = event.dataTransfer.files?.[0];
            if (file) {
                setGeoPackage(file);
            }
            else {
                throw new Error("File not found!");
            }
        }
    };

    return (
        <div>
            <div className="loader-container" onDragOver={onDragOver} onDrop={onDrop}>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="file-input"
                />
                <div className="drop-zone">
                    <p>Drag and drop files here or <span onClick={() => fileInputRef.current?.click()}>select files</span></p>
                </div>
            </div>
            <div className='file-loader-prompt'>
                <span>Supported file types for conversion are GeoJSON, Shapefile, Shapefile Zip, KML</span>
            </div>
            <GeoJSONMapDisplay geoJsonData={geoJsonData} />
        </div>
    );
};