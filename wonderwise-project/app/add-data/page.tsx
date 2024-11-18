'use client'

import React from 'react';
import { useAuth } from '@/app/context/AuthContext';
import addAccommodationsToFirestore from '@/utils/addAccommodationsToFirestore';

const AddAccommodationsButton = () => {
  const { user } = useAuth();

  const handleAddAccommodations = async () => {
    if (user) {
      await addAccommodationsToFirestore(user.uid);
    } else {
      console.error('User is not authenticated');
    }
  };

  return (
    <button onClick={handleAddAccommodations} className="bg-blue-500 text-white px-4 py-2 rounded">
      Add Accommodations to Firestore
    </button>
  );
};

export default AddAccommodationsButton;