import React, { useEffect, useRef, useState } from 'react';
import '../../../css/FileLoader.css';
import apiClient from '../../../services/apiClient';
import fileClient from '../../../services/fileClient';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const FileUploader = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileData, setFileData] = useState<File | null>(null);
    const [projectName, setProjectName] = useState('Unamed Project');

    const [uploadFile, setUploadFile] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth0();
    const [newMapId, setNewMapId] = useState<string>("");
    const [finished, setFinished] = useState<boolean>(false);
    const [contentType, setContentType] = useState<string>("");
    /**
        * Handle File Load / Change, Send to Controller for Conversion
        * 
        * @param event: React.ChangeEvent<HTMLInputElement>
        * 
        * @returns void
    */

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setContentType(event.target.files[0].type);
            setFileData(event.target.files[0]);
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
        if (event.dataTransfer.files) {
            setContentType(event.dataTransfer.files[0].type);
            setFileData(event.dataTransfer.files[0]);
        }
    };
    const handleSubmit = () => {
        setUploadFile(true);
    };

    useEffect(() => {
        const createMap = async (userId: string, mapName: string, importFile: File | null) => {
            var mapId: string | null = null;
            try {
                const response_create = await apiClient.post(`/map?userId=${userId}`);
                if (response_create.status === 201) {
                    console.log("Map created successfully");
                    mapId = response_create.data._id;
                    // setNewMapId(response.data._id.toString());
                    // console.log(response.data);
                } else {
                    console.error("Failed to create map");
                    // Handle errors
                }
                if (importFile) {
                    const response_file = await fileClient.post(`?user_id=${userId}`, importFile, {
                        headers: {
                            "Content-Type": contentType
                        }
                    });
                    if (response_file.status === 201) {
                        console.log("File uploaded successfully");
                        // console.log(response.data);
                    } else {
                        console.error("Failed to upload file");
                        // Handle errors
                    }
                    const response_import = await apiClient.put(`/map/import?userId=${userId}&mapId=${response_create.data._id}&objectId=${response_file.data.object_id}`);
                    if (response_import.status === 200) {
                        console.log("File imported successfully");
                        // console.log(response.data);
                    } else {
                        console.error("Failed to import file");
                        // Handle errors
                    }
                }
                const response_rename = await apiClient.put(`/map?mapId=${response_create.data._id}&userId=${userId}`, { name: mapName });
                if (response_rename.status === 200) {
                    console.log("File renamed successfully");
                    // console.log(response.data);
                } else {
                    console.error("Failed to rename file");
                    // Handle errors
                }
                // const response2 = await apiClient.put(`/map/update?userId=${userId}&mapId=${response.data._id}&name=${mapName}`);
            } catch (err) {
                console.error("Error while creating map", err);
            } finally {
                if (mapId) {
                    setNewMapId(mapId);
                }
                setLoading(false);
                setFinished(true);
            }
        };
        if (user?.sub && uploadFile) {
            setLoading(true);
            createMap(user.sub, projectName, fileData);
        }
        // eslint-disable-next-line
    }, [uploadFile]);

    if (false) {
        return (<Link to="/login">Login to create a map</Link>);
    }
    else if (loading) {
        return (<div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>);
    }
    else if (finished) {
        return (<Navigate to={`/map/${newMapId}`} />);
    }
    else {
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
                        {fileData && <p>File {fileData.name} selected! <span onClick={() => setFileData(null)}>Clear</span></p>}
                        <p>Drag and drop files here or <span onClick={() => fileInputRef.current?.click()}>select files</span></p>
                    </div>
                </div>
                <br />
                <div className='file-loader-prompt'>
                    <span>Supported file types for conversion are GeoJSON, Shapefile Zip and KML.</span>
                    <br />
                    <span>Note: import file here is optional.</span>
                </div>
                <div className="file-uploader-buttons">
                    <button onClick={handleSubmit} className="btn btn-primary">Create</button>
                </div>
            </div>
        );
    }
};

export default FileUploader;