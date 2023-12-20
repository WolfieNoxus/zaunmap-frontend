import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { GeomanControls } from "react-leaflet-geoman-v2";
import { FeatureGroup } from "react-leaflet";
import { FeatureCollection } from "geojson";
import { defaultRegionStyles } from "../Interfaces/IRegionStyles";
import React from "react";
import L from "leaflet";
import IGeoJsonProperties from // defaultGeoJsonProperties,
"../Interfaces/IGeoJsonProperties";

interface Props {
  geojson: FeatureCollection;
  setGeojson: (geojson: FeatureCollection) => void;
  selectedProperties: IGeoJsonProperties;
  setSelectedProperties: (properties: IGeoJsonProperties) => void;
}

export default function Geoman({
  geojson,
  setGeojson,
  selectedProperties,
  setSelectedProperties,
}: Props) {
  const ref = React.useRef<L.FeatureGroup>(null);
  // let geojsonLayer: L.GeoJSON = React.useRef(null);;

  const onEachFeature = React.useCallback(
    (feature: any, layer: any) => {
      feature.properties.name =
        feature.properties.name ||
        feature.properties.ADMIN ||
        feature.properties.admin;
      const name = feature.properties.name;
      // const countryName = feature.properties.ADMIN;
      if (feature.properties.name !== undefined) {
        layer.bindPopup(name);
      }

      layer.on({
        click: (event: any) => {
          // console.log("Click")
          // console.log(event.target.feature.properties.ADMIN);
          // console.log(event.target.feature.properties.styles);

          if (event.target.feature.properties === undefined) {
            // event.target.feature.properties = defaultGeoJsonProperties;
            setSelectedProperties(feature.properties);
          } else {
            if (event.target.feature.properties.styles === undefined) {
              event.target.feature.properties.styles = defaultRegionStyles;
            }
            setSelectedProperties({
              ...event.target.feature.properties,
            });
            // event.target.feature.properties = selectedProperties;
          }
          console.log(selectedProperties);

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
            feature.properties.styles
              ? feature.properties.styles
              : defaultRegionStyles
          );
          l.bringToBack();
        },
      });
    },
    [selectedProperties, setSelectedProperties]
  );

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
          //
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
