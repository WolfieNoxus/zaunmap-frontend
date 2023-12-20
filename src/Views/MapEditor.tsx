import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { GeomanControls } from "react-leaflet-geoman-v2";
import { FeatureGroup, useMap } from "react-leaflet";
import { FeatureCollection } from "geojson";
import { defaultRegionStyles } from "../Interfaces/IRegionStyles";
import React, { useEffect } from "react";
import L from "leaflet";
import IGeoJsonProperties, {
  defaultGeoJsonProperties, // defaultGeoJsonProperties,
} from "../Interfaces/IGeoJsonProperties";

interface Props {
  geojson: FeatureCollection;
  setGeojson: (geojson: FeatureCollection) => void;
  selectedProperties: IGeoJsonProperties;
  setSelectedProperties: (properties: IGeoJsonProperties) => void;
  newProperties: IGeoJsonProperties;
  setChanged: (changed: boolean) => void;
}

export default function Geoman({
  geojson,
  setGeojson,
  // selectedProperties,
  setSelectedProperties,
  newProperties,
  setChanged,
}: Props) {
  const ref = React.useRef<L.FeatureGroup>(null);
  // let geojsonLayer: L.GeoJSON = React.useRef(null);;

  const map = useMap();

  const onEachFeature = React.useCallback(
    (feature: any, layer: any) => {
      feature.properties.name =
        feature.properties.name ||
        feature.properties.ADMIN ||
        feature.properties.admin;
      // const name = feature.properties.name;
      // const countryName = feature.properties.ADMIN;
      // if (feature.properties.name !== undefined) {
      //     layer.bindPopup(feature.properties.name);
      // }

      layer.on({
        click: (event: any) => {
          // console.log("Click")
          // console.log(event.target.feature.properties.ADMIN);
          // console.log(event.target.feature.properties.styles);

          if (event.target.feature.properties === undefined) {
            event.target.feature.properties = defaultGeoJsonProperties;
            event.target.feature.properties.editId = 0;
          } else if (event.target.feature.properties.styles === undefined) {
            event.target.feature.properties.styles = defaultRegionStyles;
          }

          event.target.feature.properties.editId = event.target._leaflet_id;
          setSelectedProperties(event.target.feature.properties);
          // event.target.set
          map.fitBounds(event.target.getBounds());
        },
        mouseover: (event: any) => {
          if (event.target.feature.type === "Point") {
            return;
          }
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
          if (event.target.feature.type === "Point") {
            return;
          }
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
    [setSelectedProperties, map]
  );

  useEffect(() => {
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

  useEffect(() => {
    const updateProperties = (newProperties: IGeoJsonProperties) => {
      const layers = ref.current?.getLayers();
      const newGeo: FeatureCollection = {
        type: "FeatureCollection",
        features: [],
      };
      if (layers) {
        layers.forEach((layer) => {
          if (
            layer instanceof L.Polyline ||
            layer instanceof L.Polygon ||
            layer instanceof L.Marker ||
            layer instanceof L.Circle ||
            layer instanceof L.CircleMarker ||
            layer instanceof L.Rectangle
          ) {
            if (
              layer.feature &&
              layer.feature.properties.editId === newProperties.editId
            ) {
              layer.feature.properties = newProperties;
            }
            newGeo.features.push(layer.toGeoJSON());
          }
        });
      }
      setGeojson(newGeo);
    };

    if (newProperties.editId !== undefined) {
      updateProperties(newProperties);
    }
  }, [newProperties, setGeojson]);

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
    setChanged(true);
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
