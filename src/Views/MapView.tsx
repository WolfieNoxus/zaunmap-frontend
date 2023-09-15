import { Component } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type MapViewProps = {
    fileData: File | null;
};

class MapView extends Component<MapViewProps> {
    render() {
        return (
            <MapContainer 
                center={[0, 0]} 
                zoom={4}
                minZoom={1}
                style={{ height: "700px", width: "100%" }}
                maxBounds={[
                    [-90, -180],
                    [90, 180]
                ]}
                maxBoundsViscosity={1}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
            </MapContainer>
        );
    }
}

export default MapView;
