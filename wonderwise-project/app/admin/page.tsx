

'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import ListingCard from '@/app/components/ListingCard';
import { Accommodation } from '@/types/package';
import { useAuth } from '../context/AuthContext';


const AdminPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth(); // Get the logged-in user and loading state
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchAccommodations = async () => {
      if (!user) return; // Ensure user is defined
      try {
        const q = query(collection(db, 'accommodations'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const accommodationsData: Accommodation[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Accommodation[];
        setAccommodations(accommodationsData);
      } catch (error) {
        console.error('Error fetching accommodations: ', error);
      } finally {
        setLoadingData(false);
      }
    };

    if (!loading) {
      fetchAccommodations();
    }
  }, [user, loading]);

  const handleAddNew = () => {
    router.push('/admin/add');
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'accommodations', id));
      setAccommodations(accommodations.filter((accommodation) => accommodation.id !== id));
    } catch (error) {
      console.error('Error deleting accommodation: ', error);
    }
  };

  if (loading || loadingData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <button onClick={handleAddNew} className="p-2 bg-green-500 text-white rounded mb-4">
        Add New Listing
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {accommodations.map((accommodation) => (
          <div key={accommodation.id} className="relative">
            <ListingCard {...accommodation} />
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={() => handleEdit(accommodation.id)}
                className="p-2 bg-blue-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(accommodation.id)}
                className="p-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;