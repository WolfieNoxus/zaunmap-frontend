import React from "react";
import { BiInfoCircle } from "react-icons/bi";
// import { ZoomControl } from "react-leaflet";

const BottomLeft = () => {
  return (
    <div>
      <div>
        {/* <ZoomControl position="bottomleft" /> */}
      </div>
      <BiInfoCircle className="component-bottom-left" size={40} color="4B4F5D"/>
    </div>
  );
};

export default BottomLeft;
