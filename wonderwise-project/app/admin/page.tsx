'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import ListingCard from '@/app/components/ListingCard';
import { useAuth } from '../context/AuthContext';

interface Accommodation {
  userId: string; // Change to string
  id: string;
  name: string;
  city: string;
  description: string;
  price: number;
  guests: number;
  rooms: number;
  images: string[];
  category?: string;
}

const AdminPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth(); // Get the logged-in user and loading state
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const fetchAccommodations = useCallback(async () => {
    if (!user) return; // Ensure user is defined
    try {
      const q = query(collection(db, 'accommodations'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const fetchedAccommodations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Accommodation[];
      setAccommodations(fetchedAccommodations);
    } catch (error) {
      console.error('Error fetching accommodations:', error);
    } finally {
      setLoadingData(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAccommodations();
  }, [fetchAccommodations]);

  const handleDelete = async (id: string) => {
    try {
      const docRef = doc(db, 'accommodations', id);
      await deleteDoc(docRef);
      fetchAccommodations(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  if (loading || loadingData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My WonderWise Dashboard</h1>
      <div className="flex space-x-4 mb-4">
        <button onClick={() => router.push('/admin/add')} className="p-2 bg-green-500 text-white rounded">
          Add New Listing
        </button>
        <button onClick={() => router.push('/admin/profile')} className="p-2 bg-blue-500 text-white rounded">
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {accommodations.map((accommodation) => (
          <div key={accommodation.id} className="relative">
            <ListingCard {...accommodation} />
            {user?.uid === accommodation.userId && (
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => router.push(`/admin/edit/${accommodation.id}`)}
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;