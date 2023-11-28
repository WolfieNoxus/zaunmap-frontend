import React, { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { MapWrapper } from "../Views/MapWrapper";
import ErrorPage from '../errorPage';

async function getFileFromUrl(url: string, filename: string): Promise<File> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();

    const file = new File([blob], filename, {
        type: blob.type,
    });

    return file;
}

function Map() {

    const mapId = useLoaderData();

    console.log(mapId);

    const [fileData, setFileData] = useState<File | null>(null);
    const fileType = "kml";

    useEffect(() => {
        (async () => {
            try {
                const file = await getFileFromUrl("https://pub-72fd97a9b6014d9f808b63a2f4b8d1b5.r2.dev/sample.kml", "sample.kml");
                setFileData(file);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    if (mapId === null) {
        return <ErrorPage />;
    } else if (typeof mapId !== "string") {
        return <ErrorPage />;
    } else if (mapId === "") {
        return <ErrorPage />;
    } else if (Number.isInteger(Number(mapId)) === false) {
        return <ErrorPage />;
    } else if (Number(mapId) > 3 || Number(mapId) < 1) {
        return <ErrorPage />;
    }
    return (
        <div>
            <MapWrapper fileType={fileType} fileData={fileData} />
        </div>
    );
};

export default Map;