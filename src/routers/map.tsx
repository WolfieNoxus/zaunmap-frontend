import React, { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import GeomanWrapper from "../Views/MapEditor";
import { MapContainer, TileLayer, ZoomControl, GeoJSON } from "react-leaflet";
import IMap, { defaultMap } from "../Interfaces/IMap";
import apiClient from "../services/apiClient";
import fileClient from "../services/fileClient";
import EditBar from "../Views/Components/Elements/EditBar";
import { useNavigate } from "react-router-dom";
import "./../Views/css/mapEdit.css";
import { useAuth0 } from "@auth0/auth0-react";
// Icons Button
import { RiCommunityLine } from "react-icons/ri"; // TopLeft
import { BiSolidUserCircle } from "react-icons/bi"; // TopRight
import { BiInfoCircle } from "react-icons/bi"; // BottomLeft
import { MdAddCircle, MdChatBubbleOutline } from "react-icons/md"; // BottomRight
import IPopupProps, { defaultPopupProps } from "../Interfaces/IPopupProps";
import IUser, { defaultUser } from "../Interfaces/IUser";
import IGeoJsonProperties, {defaultGeoJsonProperties} from "../Interfaces/IGeoJsonProperties";
import Popup from "../Views/Components/Popup";

// async function getFileFromUrl(url: string, filename: string): Promise<File> {
//     const response = await fetch(url);
//     if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const blob = await response.blob();

//     const file = new File([blob], filename, {
//         type: blob.type,
//     });

//     return file;
// }

function Map() {
  const navigate = useNavigate();

  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

  const mapId = useLoaderData();
  if (typeof mapId !== "string") {
    throw new Error("Map ID is not a string");
  }
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [loggedinUser, setLoggedinUser] = useState<IUser>(defaultUser);
  const [map, setMap] = useState<IMap>(defaultMap);

  const [geojson, setGeojson] = useState<
    GeoJSON.FeatureCollection<GeoJSON.GeometryObject>
  >({
    type: "FeatureCollection",
    features: [],
  });
  const [popupPage, setPopupPage] = useState<IPopupProps>(defaultPopupProps);

  const [selectedProperties, setSelectedProperties] =
    useState<IGeoJsonProperties>(defaultGeoJsonProperties);

  const handleClosePopup = () => {
    setShowPopup(false);
    // setDisableOtherComponents(false);
  };

  const onEachFeature = React.useCallback((feature: any, layer: any) => {
    const countryName = feature.properties.ADMIN;
    layer.bindPopup(countryName);

    layer.on({
      click: (event: any) => {
        // console.log(event.target.feature.properties.ADMIN);
        // console.log(event.target);
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
            : defaultGeoJsonProperties.styles
        );
        l.bringToBack();
      },
    });
  }, []);

  //
  useEffect(() => {
    const fetchUserData = async (sub: string) => {
      try {
        const response = await apiClient.get(`/user?userId=${sub}`);
        if (response.status === 200) {
          const userData: IUser = response.data;
          // console.log("User data retrieved successfully:", userData);
          setLoggedinUser(userData);
        } else {
          console.error("Failed to retrieve user data");
          // Handle errors
        }
      } catch (err) {
        console.error("Error while fetching user data", err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.sub) {
      fetchUserData(user.sub);
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  //
  useEffect(() => {
    const fetchMapMeta = async (sub: string) => {
      try {
        const response = await apiClient.get(`/map?mapId=${mapId}`);
        if (response.status === 200) {
          const userData: IMap = response.data;
          // console.log("User data retrieved successfully:", userData);
          setMap(userData);
        } else {
          console.error("Failed to retrieve map data");
          // Handle errors
        }
      } catch (err) {
        console.error("Error while fetching map data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMapMeta(mapId);
  }, [mapId]);

  useEffect(() => {
    const fetchMapData = async (sub: IMap) => {
      try {
        const response = await fileClient.get(
          `?user_id=${sub.owner}&object_id=${sub.objectId}`
        );
        if (response.status === 200) {
          const geoJson: GeoJSON.FeatureCollection<GeoJSON.GeometryObject> =
            response.data;
          setGeojson(geoJson);
        } else {
          console.error("Failed to retrieve map data");
        }
      } catch (err) {
        console.error("Error while fetching map data", err);
      } finally {
        setLoading(false);
      }
    };

    if (map.owner && map.objectId) {
      fetchMapData(map);
    }
  }, [map]);

  useEffect(() => {
    const putMapData = async (
      sub: IMap,
      geojson: GeoJSON.FeatureCollection<GeoJSON.GeometryObject>
    ) => {
      try {
        const response = await fileClient.put(
          `?user_id=${sub.owner}&object_id=${sub.objectId}`,
          geojson,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          console.log("Successfully updated map data");
        } else {
          console.error("Failed to update map data");
        }
      } catch (err) {
        console.error("Error while updating map data", err);
      }
    };

    if (map.owner && map.objectId && map.owner === user?.sub) {
      putMapData(map, geojson);
    }
    // eslint-disable-next-line
  }, [geojson]);

  // return block
  if (loading) {
    return (
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  } else if (user?.sub === map.owner) {
    // return edit block
    return (
      <div style={{ position: "relative" }}>
        <div className="edit-map-view-heatmap">
          {/* <span>hhhhhh</span> */}
          <MapContainer
            className="structure-of-map"
            center={[0, 0]}
            zoom={4}
            minZoom={1}
            maxBounds={[
              [-90, -180],
              [90, 180],
            ]}
            maxBoundsViscosity={1}
            zoomControl={false}
          >
            <TileLayer
              attribution="Map data <a href='https://www.openstreetmap.org'>OpenStreetMap</a> contributors"
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
            />
            <GeomanWrapper
              geojson={geojson}
              setGeojson={setGeojson}
              selectedProperties={selectedProperties}
              setSelectedProperties={setSelectedProperties}
            />
            <ZoomControl position="bottomleft" />
          </MapContainer>

          <EditBar
            mapProject={map}
            onClose={() => navigate("/")}
            selectedProperties={selectedProperties}
            setSelectedProperties={setSelectedProperties}
          />

          {/* popup page */}
          {loading ? (
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            showPopup && (
              <Popup
                user={loggedinUser}
                page={popupPage.page}
                onClose={() => handleClosePopup()}
              />
            )
          )}
          <MdChatBubbleOutline
            className="edit-bottom-right-comment"
            size={40}
            color={showPopup ? "grey" : "F35D74"}
            onClick={() => {
              setPopupPage({
                page: "comments",
                user: loggedinUser,
                onClose: () => {},
              });
              setShowPopup(true);
              // setDisableOtherComponents(true);
            }}
          />
        </div>
      </div>
    );
  } else {
    // return view block
    return (
      <div style={{ position: "relative" }}>
        {/* <span>hhhhhh</span> */}
        <MapContainer
          className="structure-of-map"
          center={[0, 0]}
          zoom={4}
          minZoom={1}
          maxBounds={[
            [-90, -180],
            [90, 180],
          ]}
          maxBoundsViscosity={1}
          zoomControl={false}
        >
          <TileLayer
            attribution="Map data <a href='https://www.openstreetmap.org'>OpenStreetMap</a> contributors"
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
          />
          {geojson.features.map((geoJsonObject, index) => (
            <GeoJSON
              key={index}
              data={geoJsonObject}
              style={geoJsonObject.properties?.styles}
              onEachFeature={onEachFeature}
            />
          ))}

          <ZoomControl position="bottomleft" />
        </MapContainer>

        {/* popup page */}
        {loading ? (
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          showPopup && (
            <Popup
              user={loggedinUser}
              page={popupPage.page}
              onClose={() => handleClosePopup()}
            />
          )
        )}

        {/* <div className={"no-interaction greyed-out"}> */}
        {/* <TopLeft /> */}
        <div className="component-top-left">
          <RiCommunityLine
            size={30}
            color={showPopup ? "grey" : "F35D74"}
            onClick={() => {
              setPopupPage({
                page: "community",
                user: loggedinUser,
                onClose: () => {},
              });
              setShowPopup(true);
              // setDisableOtherComponents(true);
            }}
          />
        </div>

        {/* <TopRight /> */}
        <BiSolidUserCircle
          className="component-top-right"
          color={showPopup ? "grey" : "BB2649"}
          size={40}
          onClick={() => {
            if (!isAuthenticated) {
              loginWithRedirect();
            } else {
              setPopupPage({
                page: "userProfile",
                user: loggedinUser,
                onClose: () => {},
              });
              setShowPopup(true);
              // setDisableOtherComponents(true);
            }
          }}
        />

        {/* <BottomRight /> */}
        <div className="component-bottom-right">
          <MdChatBubbleOutline
            className="component-bottom-right-comment"
            size={40}
            color={showPopup ? "grey" : "F35D74"}
            onClick={() => {
              setPopupPage({
                page: "comments",
                user: loggedinUser,
                onClose: () => {},
              });
              setShowPopup(true);
              // setDisableOtherComponents(true);
            }}
          />
          <MdAddCircle
            className="component-bottom-right-add"
            size={50}
            color={showPopup ? "grey" : "BB2649"}
            onClick={() => {
              if (!isAuthenticated) {
                loginWithRedirect();
              } else {
                setPopupPage({
                  page: "addProject",
                  user: loggedinUser,
                  onClose: () => {},
                });
                setShowPopup(true);
                // setDisableOtherComponents(true);
              }
            }}
          />
        </div>

        {/* <BottomLeft /> */}
        <div>
          <BiInfoCircle
            className="component-bottom-left"
            size={40}
            color={showPopup ? "grey" : "4B4F5D"}
            onClick={() => {
              setPopupPage({
                page: "mapInfo",
                user: loggedinUser,
                onClose: () => {},
              });
              setShowPopup(true);
              // setDisableOtherComponents(true);
            }}
          />
        </div>
        {/* </div> */}
      </div>
    );
  }
}

export default Map;
