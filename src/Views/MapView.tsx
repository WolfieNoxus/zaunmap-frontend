import { Component } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../css/FileLoader.css';
type TMapViewProps = {
    fileData: File | null;
};

class MapView extends Component<TMapViewProps> {
    render() {
        return (
            <MapContainer 
                className="structure-of-map"
                center={[0, 0]} 
                zoom={4}
                minZoom={1}
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
