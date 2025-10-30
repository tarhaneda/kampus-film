import React from 'react';

function SearchBox({ query, onSearch }) {
  
  const handleChange = (event) => {
    onSearch(event.target.value);
  };

  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Dizi ara "
        value={query} 
        onChange={handleChange}
      />
    </div>
  );
}

export default SearchBox;