import { MapContainer, TileLayer, GeoJSON, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// import { FeatureCollection,  GeometryObject } from "geojson";
import { GeoJsonObject } from "geojson";

import Popup from "./Components/Popup";
import { useState, useEffect } from "react";

import { RiCommunityLine } from "react-icons/ri"; // TopLeft
import { BiSolidUserCircle } from "react-icons/bi"; // TopRight
import { BiInfoCircle } from "react-icons/bi"; // BottomLeft
import { MdAddCircle, MdChatBubbleOutline } from "react-icons/md"; // BottomRight
import IPopupProps from "../Interfaces/IPopupProps";
import IUser from "../Interfaces/IUser";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import apiClient from "../services/apiClient";

type TGeoJSONMapViewProps = {
  geoJSONData: GeoJsonObject[];
  // geoJSONData: FeatureCollection<GeometryObject>[];
};

const GeoJSONMapView: React.FC<TGeoJSONMapViewProps> = ({ geoJSONData }) => {
  const { isAuthenticated, user } = useAuth0();
  const [loading, setLoading] = useState(true);

  const [loggedinUser, setLoggedinUser] = useState<IUser>({
    user_id: "",
    user_name: "",
    role: "user",
    maps: [],
  });

  useEffect(() => {
    const fetchUserData = async (sub: string) => {
      try {
        const response = await apiClient.get(`/user?user_id=${sub}`);
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

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [disableOtherComponents, setDisableOtherComponents] =
    useState<boolean>(false);
  const [popupPage, setPopupPage] = useState<IPopupProps>({
    page: "community",
    user: loggedinUser,
    onClose: () => {},
  });

  const handleClosePopup = () => {
    setShowPopup(false);
    setDisableOtherComponents(false);
  };

  return (
    <div>
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
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {geoJSONData.map((geoJsonObject, index) => (
          <GeoJSON key={index} data={geoJsonObject} />
        ))}
        {/* {geoJSONData.map((feature, index) => (<GeoJSON key={index} data={feature} />))} */}
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

      <div
        className={disableOtherComponents ? "no-interaction greyed-out" : ""}
      >
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
              setDisableOtherComponents(true);
            }}
          />
        </div>

        {/* <TopRight /> */}
        <BiSolidUserCircle
          className="component-top-right"
          color={showPopup ? "grey" : "BB2649"}
          size={40}
          onClick={() => {
            setPopupPage({
              page: "userProfile",
              user: loggedinUser,
              onClose: () => {},
            });
            setShowPopup(true);
            setDisableOtherComponents(true);
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
              setDisableOtherComponents(true);
            }}
          />
          <MdAddCircle
            className="component-bottom-right-add"
            size={50}
            color={showPopup ? "grey" : "BB2649"}
            onClick={() => {
              setPopupPage({
                page: "addProject",
                user: loggedinUser,
                onClose: () => {},
              });
              setShowPopup(true);
              setDisableOtherComponents(true);
            }}
          />
        </div>

        {/* <BottomLeft /> */}
        <div>
          <Link reloadDocument to={"/edit"}>
            <BiInfoCircle
              className="component-bottom-left"
              size={40}
              color={showPopup ? "grey" : "4B4F5D"}
              // onClick={() => {
              //   setPopupPage({
              //     page: "mapInfo",
              //     user: loggedinUser,
              //     onClose: () => {},
              //   });
              //   setShowPopup(true);
              //   setDisableOtherComponents(true);
              // }}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GeoJSONMapView;
