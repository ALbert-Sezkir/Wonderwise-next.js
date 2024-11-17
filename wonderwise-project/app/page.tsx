'use client'

import React from 'react';
import Searchbar from './components/Searchbar';
import AccommodationsList from './components/AccommodationsList';


const HomePage = () => {
  return (
    
      <div className="p-4 flex flex-col items-center justify-center pb-20">
        <div className="w-full flex flex-col items-center">
          <Searchbar />
          
          <div className="w-4/5 mt-4">
            <AccommodationsList />
          </div>
        </div>
      </div>
    
  );
};

export default HomePage;