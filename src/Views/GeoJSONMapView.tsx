import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { GeoJsonObject } from 'geojson';

type TGeoJSONMapViewProps = {
    geoJSONData: GeoJsonObject[];
};

const GeoJSONMapView: React.FC<TGeoJSONMapViewProps> = ({ geoJSONData }) => {
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
            { geoJSONData.map( (geoJsonObject, index) => ( <GeoJSON key={index} data={geoJsonObject} />) ) }

        </MapContainer>
    );
}

export default GeoJSONMapView;