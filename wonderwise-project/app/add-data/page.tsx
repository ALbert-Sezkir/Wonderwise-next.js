'use client'

import React from 'react';
import addAccommodationsToFirestore from '@/utils/addAccommodationsToFirestore';

const AddAccommodationsButton = () => {
  const handleAddAccommodations = async () => {
    await addAccommodationsToFirestore();
  };

  return (
    <button onClick={handleAddAccommodations} className="bg-blue-500 text-white px-4 py-2 rounded">
      Add Accommodations to Firestore
    </button>
  );
};

export default AddAccommodationsButton;