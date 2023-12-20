import React, { useEffect, useState } from 'react';
import '../../../css/FileLoader.css';
import apiClient from '../../../services/apiClient';
import { useAuth0 } from '@auth0/auth0-react';

interface Props {
    objectId: string;
    userId: string;
};

const ForkProject = (
    { objectId, userId }: Props
) => {
    const [projectName, setProjectName] = useState('Unamed Project');

    const [uploadFile, setUploadFile] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth0();
    const [newMapId, setNewMapId] = useState<string>("");
    const [finished, setFinished] = useState<boolean>(false);

    const handleSubmit = () => {
        setUploadFile(true);
    };

    useEffect(() => {
        const createMap = async (userId: string, mapName: string, object: string, importUserId: string) => {
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
                const response_import = await apiClient.put(`/map/import?userId=${userId}&mapId=${response_create.data._id}&objectId=${object}&objectOwner=${importUserId}`);
                if (response_import.status === 200) {
                    console.log("File imported successfully");
                    // console.log(response.data);
                } else {
                    console.error("Failed to import file");
                    // Handle errors
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
            createMap(user.sub, projectName, objectId, userId);
        }
        // eslint-disable-next-line
    }, [uploadFile]);

    if (loading) {
        return (<div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>);
    }
    else if (finished) {
        window.location.href = `/map/${newMapId}`;
        return (<div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
    </div>);
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
                <div className="file-uploader-buttons">
                    <button onClick={handleSubmit} className="btn btn-primary">Create</button>
                </div>
            </div>
        );
    }
};

export default ForkProject;