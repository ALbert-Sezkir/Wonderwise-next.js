'use client'

import { Search, Settings2 } from "lucide-react";
import React, { useState, ChangeEvent } from "react";
import SearchModal from './SearchModal';
import { useSearch } from '../context/SearchContext';

const Searchbar: React.FC = () => {
  const { setSearchTerm } = useSearch();
  const [searchTerm, setLocalSearchTerm] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLocalSearchTerm(value);
    setSearchTerm(value);
  };

  return (
    <div className="flex justify-center w-full mb-4">
      <div className="relative w-[300px]">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full h-9 bg-brunswickgreen text-timberwolf placeholder-timberwolf px-4 py-2 rounded-xl focus:outline-none"
        />
        <div className="absolute inset-y-0 right-3 flex items-center">
          <Search color="var(--timberwolf)" size={28} className="" />
        </div>
      </div>
      <Settings2
        color="var(--brunswickgreen)"
        size={28}
        className="ml-2 cursor-pointer"
        onClick={() => setModalOpen(true)}
      />
      <SearchModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Searchbar;