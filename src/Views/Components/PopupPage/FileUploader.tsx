import React, { useRef, useState } from 'react';
import '../../../css/FileLoader.css';

const FileUploader = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileData, setFileData] = useState<File | null>(null);
    const [fileType, setFileType] = useState<string | null>(null);
    const [projectName, setProjectName] = useState('');
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
            const fileHeader = file.name.split(".").slice(1).join(".");
            // console.log(file.name);
            if (fileHeader === "geo.json" || fileHeader === "geojson"){
                setFileType(fileHeader);
                setFileData(file);
            }
            else if (fileHeader === "kml") {
                setFileType(fileHeader);
                setFileData(file);
            }
            else if (fileHeader === "zip" || fileHeader === "shp") {
                setFileType(fileHeader);
                setFileData(file);
            }   
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
                const fileHeader = file.name.split(".").slice(1).join(".")
                if (fileHeader === "geo.json" || fileHeader === "geojson"){
                    setFileType(fileHeader);
                    setFileData(file);
                }
                else if (fileHeader === "kml") {
                    setFileType(fileHeader);
                    setFileData(file);
                }
                else if (fileHeader === "zip" || fileHeader === "shp") {
                    setFileType(fileHeader);
                    setFileData(file);
                }   
            }
            else {
                throw new Error("File not found!");
            }
        }
    };
    const handleSubmit = () => {
        // Logic for handling submit action
        console.log(fileData);
    };
    
    const handleCancel = () => {
        // Logic for handling cancel action
        console.log(fileType);
    };

return (
    <div className="file-uploader-container"> {/* Flex container */}
        <div className="project-name-input">
            <span style={{ marginRight: '20px' }}>Enter Project Name:</span>
            <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
            />
        </div>
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
        <div className="file-uploader-buttons">
            <button onClick={handleSubmit} className="btn btn-primary">Submit</button>
            <button onClick={handleCancel} className="btn btn-danger ms-3">Cancel</button>
      </div>
    </div>
);};

export default FileUploader;