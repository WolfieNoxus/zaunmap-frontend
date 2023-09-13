import { useRef } from 'react';
import { GeoPackage } from '@ngageoint/geopackage';

import Converters from "../Controllers/Converters";

import '../css/FileLoader.css';

export default function FileLoaderView({ children, setGeoPackage }: { children: any, setGeoPackage: (geoPackage: GeoPackage) => void }) {

    /**
     * Handle File Load / Change, Send to Controller for Conversion
     * 
     * @param event: React.ChangeEvent<HTMLInputElement>
     * 
     * @returns void
     */

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setGeoPackage(Converters(file));
        }
        else {
            throw new Error("File not found!");
        }
    };

    const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (event.dataTransfer) {
            const file = event.dataTransfer.files?.[0];
            if (file) {
                setGeoPackage(Converters(file));
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
        </div>
    );
};