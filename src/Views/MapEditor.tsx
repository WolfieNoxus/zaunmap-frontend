import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { GeomanControls } from "react-leaflet-geoman-v2";
import { FeatureGroup } from "react-leaflet";
import { FeatureCollection } from "geojson";
import React from "react";
import L from "leaflet";

interface Props {
  geojson: FeatureCollection;
  setGeojson: (geojson: FeatureCollection) => void;
}

export default function Geoman({ geojson, setGeojson }: Props) {
  const ref = React.useRef<L.FeatureGroup>(null);
  // let geojsonLayer: L.GeoJSON = React.useRef(null);;

  const onEachFeature = React.useCallback((feature: any, layer: any) => {
    const defaultStyle = {
      stroke: true,
      color: "#3388ff",
      weight: 3,
      opacity: 1.0,
      lineCap: "round",
      lineJoin: "round",
      dashArray: null,
      dashOffset: null,
      // fill : true, // Adjust the default as needed
      fillColor: "#3388ff",
      fillOpacity: 0.2,
      fillRule: "evenodd",
      bubblingMouseEvents: true,
      // renderer, // No default provided
      className: null,
    };
    const countryName = feature.properties.ADMIN;
    layer.bindPopup(countryName);

    layer.on({
      click: (event: any) => {
        // console.log("Click")
        console.log(event.target.feature.properties.ADMIN);
        console.log(event.target);
        // event.target.set
      },
      mouseover: (event: any) => {
        var l = event.target;

        l.setStyle({
          weight: 5,
          color: "#666",
          dashArray: "",
          fillOpacity: 0.7,
          fillColor: "white",
        });

        l.bringToFront();
      },
      mouseout: (event: any) => {
        var l = event.target;
        l.setStyle(
          feature.properties.styles ? feature.properties.styles : defaultStyle
        );
        l.bringToBack();
      },
    });
  }, []);

  React.useEffect(() => {
    if (ref.current?.getLayers().length === 0 && geojson) {
      L.geoJSON(geojson, {
        style: (feature: any) => {
          // Return the styles defined in the feature properties
          return feature.properties.styles;
        },
        onEachFeature: onEachFeature,
      }).eachLayer((layer) => {
        if (
          layer instanceof L.Polyline ||
          layer instanceof L.Polygon ||
          layer instanceof L.Marker
        ) {
          if (layer?.feature?.properties.radius && ref.current) {
            new L.Circle(layer.feature.geometry.coordinates.slice().reverse(), {
              radius: layer.feature?.properties.radius,
            }).addTo(ref.current);
          } else {
            ref.current?.addLayer(layer);
          }
        }
      });
    }
  }, [geojson, onEachFeature]);

  const handleChange = () => {
    const newGeo: FeatureCollection = {
      type: "FeatureCollection",
      features: [],
    };
    const layers = ref.current?.getLayers();
    if (layers) {
      layers.forEach((layer) => {
        if (layer instanceof L.Circle || layer instanceof L.CircleMarker) {
          const { lat, lng } = layer.getLatLng();
          newGeo.features.push({
            type: "Feature",
            properties: {
              radius: layer.getRadius(),
            },
            geometry: {
              type: "Point",
              coordinates: [lng, lat],
            },
          });
        } else if (
          layer instanceof L.Marker ||
          layer instanceof L.Polygon ||
          layer instanceof L.Rectangle ||
          layer instanceof L.Polyline
        ) {
          newGeo.features.push(layer.toGeoJSON());
        }
      });
    }
    setGeojson(newGeo);
  };

  return (
    <FeatureGroup ref={ref}>
      <GeomanControls
        options={{
          position: "topleft",
          drawText: false,
        }}
        globalOptions={{
          continueDrawing: true,
          editable: false,
        }}
        eventDebugFn={console.log}
        onCreate={handleChange}
        onChange={handleChange}
        onUpdate={handleChange}
        onEdit={handleChange}
        onMapRemove={handleChange}
        onMapCut={handleChange}
        onDragEnd={handleChange}
        onMarkerDragEnd={handleChange}
      />
    </FeatureGroup>
  );
}
