import React from "react";
import { RiCommunityLine } from "react-icons/ri";
import CommunityList from "./Elements/CommunityList";

// const CommunityIcon = () => {
//   return (
//       <svg 
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 24 24"
//         width="30"
//         height="30"
//         style={{ fill: "#F35D74", boxShadow: '5px 3px 10px 0px rgba(0, 0, 0, 0.75)'}}
//       >
//         <path d="M21 21H3C2.44772 21 2 20.5523 2 20V12.4868C2 12.1978 2.12501 11.9229 2.34282 11.733L6 8.54435V4C6 3.44772 6.44772 3 7 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21ZM9 19H12V12.9416L8 9.45402L4 12.9416V19H7V15H9V19ZM14 19H20V5H8V7.12729C8.23444 7.12729 8.46888 7.20938 8.65718 7.37355L13.6572 11.733C13.875 11.9229 14 12.1978 14 12.4868V19ZM16 11H18V13H16V11ZM16 15H18V17H16V15ZM16 7H18V9H16V7ZM12 7H14V9H12V7Z"></path>
//       </svg>
//   );
// };

const TopLeft = () => {
  // const [searchBar, setSearchBar] = React.useState(false);
  const [communityListShown, setCommunityListShown] = React.useState(false);

  return (
    <div className="component-top-left">
      <RiCommunityLine
        // className="ml-5"
        onClick={() => {
          // setSearchBar(false);
          setCommunityListShown(!communityListShown);
        }}
        size={30}
        color="F35D74"
      />
      {/* <CommunityIcon /> */}
      {/* <BiSearch
        className="ml-5"
        onClick={() => {
          setSearchBar(!searchBar);
          setCommunityListShown(false);
        }}
        size={30}
        color="F35D74"
      /> */}
      {communityListShown && <CommunityList />}
      {/* {searchBar && <SearchBar />} */}
    </div>
  );
};

export default TopLeft;
