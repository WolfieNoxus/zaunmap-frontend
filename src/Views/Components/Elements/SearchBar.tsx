import React, { FC, useState } from 'react';
import { BiSearch, BiX } from "react-icons/bi";
import "./css/searchBar.css";

interface SearchBarProps {
  onSearch: (name: string, tags: string, sortBy: string, sortOrder: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
  const [searchMode, setSearchMode] = useState<string>('name'); // 'name' or 'tags'
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [sortField, setSortField] = useState<string>('name'); // Default sort field
  const [sortOrder, setSortOrder] = useState<string>('asc'); // Default sort order

  const handleSearch = () => {
    onSearch(searchMode === 'name' ? searchQuery : '', 
             searchMode === 'tags' ? selectedTag : '', 
             sortField, sortOrder);
  };

  const clearInput = () => {
    setSearchQuery('');
    setSelectedTag('');
  };

  return (
    <div className="search-container mb-3">
      <div className="search-mode-selector">
        <select value={searchMode} onChange={(e) => setSearchMode(e.target.value)}>
          <option value="name">Name</option>
          <option value="tags">Tags</option>
        </select>
      </div>
      <div className="input-with-clear">
        <input
          className="search-box"
          type="text"
          placeholder={searchMode === 'name' ? "Search by name..." : "Search by tags..."}
          value={searchMode === 'name' ? searchQuery : selectedTag}
          onChange={(e) => searchMode === 'name' ? setSearchQuery(e.target.value) : setSelectedTag(e.target.value)}
        />
        {(searchQuery || selectedTag) && <BiX onClick={clearInput} />}
      </div>
      <div className="sorting-options">
        Sort By:&nbsp;
        <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
          {/* Add options for different sort fields */}
          <option value="name">Name</option>
          <option value="tags">Tags</option>
          {/* Add more options as needed */}
        </select>
        Sort Order:&nbsp;
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div className="search-icon">
        <BiSearch color="#4B4F5D" onClick={handleSearch}/>
      </div>
    </div>
  );
};

export default SearchBar;
