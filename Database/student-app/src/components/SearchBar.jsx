import React from "react";

function SearchBar({ search, setSearch }) {

  return (

    <input
      type="text"
      placeholder="Search lessons..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

  );
}

export default SearchBar;