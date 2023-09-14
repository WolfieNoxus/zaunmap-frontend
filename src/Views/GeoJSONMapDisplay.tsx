import { MapContainer, TileLayer, GeoJSON, useMapEvents } from 'react-leaflet';
import { LatLngTuple, LatLngBoundsLiteral, LatLng, LatLngBounds} from 'leaflet';
import 'leaflet/dist/leaflet.css';
type MapDisplayProps = {
    geoJsonData: any; 
};

const GeoJSONMapDisplay: React.FC<MapDisplayProps> = ({ geoJsonData }) => {
    // geographic coordinates of the intersection of the Equator and the Prime Meridian
    const center : LatLngTuple = [0, 0];
    // set up the bounds of the map
    const WORLD_BOUNDS: LatLngBoundsLiteral = [
        [-90, -180], // South-west corner
        [90, 180],   // North-east corner
    ];
    /**
     * The duplicateGeoJSONForWraparound function takes a GeoJSON object as input and 
     * returns an array of duplicated GeoJSON objects that have been shifted by a certain 
     * longitude offset. These duplicates can be used to render multiple copies of the same 
     * geographic feature on a map.
     */
    function duplicateGeoJSONForWraparound(geoJson: any): any[] {
        const duplicates = [geoJson];
        // This loop runs twice, creating two pairs of duplicates for each side of the original GeoJSON object (for a total of 4 duplicates).
        for (let i = 1; i <= 2; i++) {
            const offsetPos = JSON.parse(JSON.stringify(geoJson));
            offsetPos.features.forEach((feature: any) => {
                feature.geometry.coordinates = offsetCoordinates(feature.geometry.coordinates, i * 360);
            });

            const offsetNeg = JSON.parse(JSON.stringify(geoJson));
            offsetNeg.features.forEach((feature: any) => {
                feature.geometry.coordinates = offsetCoordinates(feature.geometry.coordinates, -i * 360);
            });

            duplicates.push(offsetPos);
            duplicates.push(offsetNeg);
        }

        return duplicates;
    }
    /**
     * offsetCoordinates takes a set of coordinates and an offset value, then shifts the longitude 
     * of the coordinates by the given offset. It is designed to handle both single points and arrays 
     * of points
     */
    function offsetCoordinates(coords: any, offset: number): any {
        // This checks if coords is a single point (an array of two numbers).
        if (typeof coords[0] === 'number') {
            return [coords[0] + offset, coords[1]];
        }
        // If coords is an array of points, then it recursively offsets each point.
        return coords.map((c: any) => offsetCoordinates(c, offset));
    }
    // Finally, allGeoJsonData calls duplicateGeoJSONForWraparound if geoJsonData exists and assigns the returned array to allGeoJsonData.
    const allGeoJsonData = geoJsonData ? duplicateGeoJSONForWraparound(geoJsonData) : [];
    // By using these functions and variables, 
    // we can create a wraparound map with duplicate features, making the map appear continuous for certain number of map when scrolled horizontally.
    return (
        <MapContainer 
        center={center} 
        zoom={4}
        minZoom={1}
        style={{ height: "650px", width: "100%" }}
        maxBounds={WORLD_BOUNDS}
        maxBoundsViscosity={1}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {allGeoJsonData.map((data, index) => <GeoJSON key={index} data={data} />)}
        </MapContainer>
    );
};

export default GeoJSONMapDisplay;
