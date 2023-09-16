import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import shp from 'shpjs';

type Props = {
    shapefileData: Blob;
};

const ShapefileMapView: React.FC<Props> = ({ shapefileData }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current!).setView([0, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstanceRef.current);
    }

    const parseShapefile = async (shapefileBlob: Blob) => {
      const arrayBuffer = await shapefileBlob.arrayBuffer();
      
      shp(arrayBuffer).then((geojson: any) => {
        L.geoJSON(geojson).addTo(mapInstanceRef.current!);
        mapInstanceRef.current!.fitBounds(L.geoJSON(geojson).getBounds());
      }).catch((err: any) => {
        console.error("Error parsing shapefile:", err);
      });
    };

    parseShapefile(shapefileData);

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };

  }, [shapefileData]);

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
}

export default ShapefileMapView;