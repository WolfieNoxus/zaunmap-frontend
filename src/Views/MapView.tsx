import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../css/reset.css"
import Popup from "./Components/Popup";
import { useState } from "react";

// Icons Button
import { RiCommunityLine } from "react-icons/ri"; // TopLeft
import { BiSolidUserCircle } from "react-icons/bi"; // TopRight
// import { BiInfoCircle } from "react-icons/bi"; // BottomLeft
import { MdAddCircle, MdChatBubbleOutline } from "react-icons/md"; // BottomRight
import IPopupProps from "./Components/PopupPage/Interfaces/IPopupProps";
import IUserProfileProps from "./Components/PopupPage/Interfaces/IUserProfileProps";

type TMapViewProps = {
  fileData: File | null;
};

const MapView: React.FC<TMapViewProps> = ({ fileData }) => {

  const userSample:IUserProfileProps = {
    userName: "John Doe",
    email: "123456@sample.com",
    userType: "User",
    projectList: [
      {
        id: 1,
        projecName: "London Subway",
        tags: ["England", "Europe"],
        userName: "John",
        view: 1240,
        viewPublic: true,
      },
      {
        id: 2,
        projecName: "Long Island",
        tags: ["USA", "North America"],
        userName: "John",
        view: 1240,
        viewPublic: true,
      },
      {
        id: 3,
        projecName: "Paris",
        tags: ["French", "Europe"],
        userName: "John",
        view: 1240,
        viewPublic: true,
      },
    ],
  };

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [disableOtherComponents, setDisableOtherComponents] = useState<boolean>(false);
  const [popupPage, setPopupPage] = useState<IPopupProps>({
    page: "community",
    user: userSample,
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
        <ZoomControl position="bottomleft" />
      </MapContainer>
      
      {/* popup page */}
      {showPopup && (
        <Popup
          user={userSample}
          page={popupPage.page}
          onClose={() => handleClosePopup()}
        />
          
      )}

      <div className={disableOtherComponents ? "no-interaction greyed-out" : ""}>
        {/* <TopLeft /> */}
        <div className="component-top-left">
          <RiCommunityLine
            size={30}
            color={showPopup ? "grey" : "F35D74"}
            onClick={() => {
              setPopupPage({
                page: "community",
                user: userSample,
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
              user: userSample,
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
                user: userSample,
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
                user: userSample,
                onClose: () => {},
              });
              setShowPopup(true);
              setDisableOtherComponents(true);
            }}
          />
        </div>

        {/* <BottomLeft /> */}
        {/* <div>
          <BiInfoCircle
            className="component-bottom-left"
            size={40}
            color={showPopup ? "grey" : "4B4F5D"}
            onClick={() => {
              setPopupPage({
                page: "mapInfo",
                user: userSample,
                onClose: () => {},
              });
              setShowPopup(true);
              setDisableOtherComponents(true);
            }}
          />
        </div> */}
      </div>
    </div>
  );
};

export default MapView;
