// file: app/page.tsx
// import React from 'react';
// import AccommodationsList from './components/AccommodationsList';

// const HomePage = () => {
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8">Available Listings</h1>
//       <AccommodationsList />
//     </div>
//   );
// };

// export default HomePage;

// file: app/page.tsx
'use client'

import AccommodationsList from "./components/AccommodationsList";


const HomePage = () => {
  return (
    <div className="p-4">
      <AccommodationsList showEditButton={false} />
    </div>
  );
};

export default HomePage;