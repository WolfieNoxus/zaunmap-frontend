import { BiSearch } from "react-icons/bi";
import "./css/searchBar.css";

const SearchBar = () => {
  return (
    <div className="outer-line">
      <BiSearch color="4B4F5D"/>
      <span className="color-span"> | </span>
      <input className="search-box" type="text" />
    </div>
  );
};

export default SearchBar;
