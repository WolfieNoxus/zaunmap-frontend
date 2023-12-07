import { FC } from 'react';
import { BiSearch } from "react-icons/bi";
import "./css/searchBar.css";

const SearchBar: FC = () => {
  return (
    <div className="search-container mb-3">
      <div className="search-icon">
        <BiSearch color="#4B4F5D"/>
      </div>
      <input className="search-box" type="text" placeholder="Search here..." />
    </div>
  );
};

export default SearchBar;
