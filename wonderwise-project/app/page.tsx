'use client'

import React from 'react';
import Searchbar from './components/Searchbar';
import AccommodationsList from './components/AccommodationsList';
import { SearchProvider } from './context/SearchContext';

const HomePage = () => {
  return (
    <SearchProvider>
      <div className="p-4 flex flex-col items-center justify-center min-h-screen pb-20">
        <div className="w-full flex flex-col items-center">
          <Searchbar />
          <div className="w-4/5 mt-4">
            <AccommodationsList />
          </div>
        </div>
      </div>
    </SearchProvider>
  );
};

export default HomePage;