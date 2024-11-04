// file: app/components/Search.tsx
import React, { useState } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import Filter from './Filter';

const Search: React.FC = () => {
  const [showFilter, setShowFilter] = useState(false);

  const handleFilterClick = () => {
    setShowFilter(!showFilter);
  };

  const handleCloseFilter = () => {
    setShowFilter(false);
  };

  return (
    <div className="relative flex flex-col items-center space-y-2 my-4">
      <div className="flex justify-center items-center space-x-2 w-2/3">
        <div className="relative flex items-center w-full">
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-2 pl-10 pr-4 bg-[#344E41] text-white rounded-md focus:outline-none"
          />
          <FaSearch className="absolute left-3 text-white" />
        </div>
        <button onClick={handleFilterClick} className="p-2 bg-[#344E41] text-white rounded-md">
          <FaFilter />
        </button>
      </div>
      {showFilter && <Filter onClose={handleCloseFilter} />}
    </div>
  );
};

export default Search;