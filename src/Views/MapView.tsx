import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Popup from "./Components/Popup";
import { useEffect, useState } from "react";

// Icons Button
import { RiCommunityLine } from "react-icons/ri"; // TopLeft
import { BiSolidUserCircle } from "react-icons/bi"; // TopRight
import { BiInfoCircle } from "react-icons/bi"; // BottomLeft
import { MdAddCircle } from "react-icons/md"; // BottomRight
// import { MdChatBubbleOutline } from "react-icons/md"; // BottomRight
import IPopupProps from "../Interfaces/IPopupProps";
import IUser from "../Interfaces/IUser";
import { useAuth0 } from "@auth0/auth0-react";
import apiClient from "../services/apiClient";

type TMapViewProps = {
  fileData: File | null;
};

const MapView: React.FC<TMapViewProps> = ({ fileData }) => {
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [loggedinUser, setLoggedinUser] = useState<IUser>({
    userId: "",
    user_name: "",
    role: "user",
    maps: [],
  });
  const [disableOtherComponents, setDisableOtherComponents] =
    useState<boolean>(false);

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

  const [popupPage, setPopupPage] = useState<IPopupProps>({
    page: "community",
    user: loggedinUser,
    onClose: () => {},
  });

  const handleClosePopup = () => {
    setShowPopup(false);
    setDisableOtherComponents(false);
  };

  // const MovingComponent = () => {
  //   const map = useMap();

  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       // Update the map center here
  //       map.setView([map.getCenter().lat, map.getCenter().lng + 0.1]);
  //     }, 1); // Update every second

  //     return () => clearInterval(interval); // Cleanup on unmount
  //   }, [map]);

  //   return null; // This component does not render anything itself
  // };

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
        {/* <MovingComponent /> */}
        <ZoomControl position="bottomleft" />
      </MapContainer>

      {/* Home page set up */}
      {!isAuthenticated ? (
        <div
          className="home-page"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
        >
          <span className="home-title">Zaun Map</span>
        </div>
      ) : (
        <div className="home-page" style={{ alignItems: "end" }}>
          <span className="home-icon mb-3">Zaun Map</span>
        </div>
      )}

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
            if (!isAuthenticated) {
              loginWithRedirect();
            } else {
              setPopupPage({
                page: "userProfile",
                user: loggedinUser,
                onClose: () => {},
              });
              setShowPopup(true);
              setDisableOtherComponents(true);
            }
          }}
        />

        {/* <BottomRight /> */}
        <div className="component-bottom-right">
          {/* <MdChatBubbleOutline
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
          /> */}
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
              setDisableOtherComponents(true);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MapView;
