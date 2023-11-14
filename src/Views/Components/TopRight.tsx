import React from "react";
import { BiSolidUserCircle } from "react-icons/bi";

function TopRight() {
  return (
    <BiSolidUserCircle
      className="component-top-right"
      color="BB2649"
      size={40}
      onClick={() => console.log('User Icon Clicked')}
    />
  );
}

export default TopRight;
