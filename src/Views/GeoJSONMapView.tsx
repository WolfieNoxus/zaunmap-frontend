import { MapContainer, TileLayer, GeoJSON, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { GeoJsonObject } from "geojson";

import Popup from "./Components/Popup";
import { useState } from "react";

import { RiCommunityLine } from "react-icons/ri"; // TopLeft
import { BiSolidUserCircle } from "react-icons/bi"; // TopRight
import { BiInfoCircle } from "react-icons/bi"; // BottomLeft
import { MdAddCircle, MdChatBubbleOutline } from "react-icons/md"; // BottomRight
import IPopupProps from "../Interfaces/IPopupProps";
import IUser from "../Interfaces/IUser";
import { Link } from "react-router-dom";

type TGeoJSONMapViewProps = {
  geoJSONData: GeoJsonObject[];
};

const GeoJSONMapView: React.FC<TGeoJSONMapViewProps> = ({ geoJSONData }) => {
  const userSample: IUser = {
    user_id: 1,
    user_name: "John Doe",
    email: "123456@sample.com",
    permission: "user",
    project_list: [
      {
        map_id: 1,
        map_name: "London Subway",
        tags: ["England", "Europe"],
        owner: "John",
        views: 1240,
        public: true,
      },
      {
        map_id: 2,
        map_name: "Long Island",
        tags: ["USA", "North America"],
        owner: "John",
        views: 1240,
        public: true,
      },
      {
        map_id: 3,
        map_name: "Paris",
        tags: ["French", "Europe"],
        owner: "John",
        views: 1240,
        public: true,
      },
    ],
  };

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [disableOtherComponents, setDisableOtherComponents] =
    useState<boolean>(false);
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
        {geoJSONData.map((geoJsonObject, index) => (
          <GeoJSON key={index} data={geoJsonObject} />
        ))}
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
        <div>
          <Link reloadDocument to={"/edit"}>
            <BiInfoCircle
              className="component-bottom-left"
              size={40}
              color={showPopup ? "grey" : "4B4F5D"}
              // onClick={() => {
              //   setPopupPage({
              //     page: "mapInfo",
              //     user: userSample,
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
