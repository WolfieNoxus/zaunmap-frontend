import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// import TopLeft from "./Components/TopLeft";
// import TopRight from "./Components/TopRight";
// import BottomRight from "./Components/BottomRight";
// import BottomLeft from "./Components/BottomLeft";
import Popup from "./Components/Popup";
import { useState } from "react";

// Icons Button
import { RiCommunityLine } from "react-icons/ri"; // TopLeft
import { BiSolidUserCircle } from "react-icons/bi"; // TopRight
import { BiInfoCircle } from "react-icons/bi"; // BottomLeft
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
        projecNname: "London Subway",
        tags: "England, Europe",
        userName: "John",
        view: 1240,
        viewPublic: true,
      },
      {
        id: 2,
        projecNname: "Long Island",
        tags: "USA, North America",
        userName: "John",
        view: 1240,
        viewPublic: true,
      },
      {
        id: 3,
        projecNname: "Paris",
        tags: "French, Europe",
        userName: "John",
        view: 1240,
        viewPublic: true,
      },
    ],
  };

  const [showPopup, setShowPopup] = useState<boolean>(false);

  const [popupPage, setPopupPage] = useState<IPopupProps>({
    page: "community",
    user: userSample,
    onClose: () => {},
  });

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
          onClose={() => setShowPopup(false)}
        />
      )}

      {/* <TopLeft /> */}
      <div className="component-top-left">
        <RiCommunityLine
          size={30}
          color="F35D74"
          onClick={() => {
            setPopupPage({
              page: "community",
              user: userSample,
              onClose: () => {},
            });
            setShowPopup(true);
          }}
        />
      </div>

      {/* <TopRight /> */}
      <BiSolidUserCircle
        className="component-top-right"
        color="BB2649"
        size={40}
        onClick={() => {
          setPopupPage({
            page: "userProfile",
            user: userSample,
            onClose: () => {},
          });
          setShowPopup(true);
        }}
      />

      {/* <BottomRight /> */}
      <div className="component-bottom-right">
        <MdChatBubbleOutline
          className="component-bottom-right-comment"
          size={40}
          color="F35D74"
          onClick={() => {
            setPopupPage({
              page: "comments",
              user: userSample,
              onClose: () => {},
            });
            setShowPopup(true);
          }}
        />
        <MdAddCircle
          className="component-bottom-right-add"
          size={50}
          color="BB2649"
        />
      </div>

      {/* <BottomLeft /> */}
      <div>
        <BiInfoCircle
          className="component-bottom-left"
          size={40}
          color="4B4F5D"
          onClick={() => {
            setPopupPage({
              page: "mapInfo",
              user: userSample,
              onClose: () => {},
            });
            setShowPopup(true);
          }}
        />
      </div>
    </div>
  );
};

export default MapView;
