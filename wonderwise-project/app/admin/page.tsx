'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import ListingCard from '@/app/components/ListingCard';
import { Accommodation } from '@/types/package';
import { useAuth } from '../context/AuthContext';

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
  }, [user]);

  useEffect(() => {
    if (!loading && user) { // Ensure `user` and `loading` state
      fetchAccommodations();
    }
  }, [user, loading, fetchAccommodations]); // Dependency on `user`, `loading`, and `fetchAccommodations` for initial fetch

  useEffect(() => {
    const handleRouteChange = () => {
      fetchAccommodations();
    };

    if (router.events) {
      router.events.on('routeChangeComplete', handleRouteChange);

      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
      };
    }
  }, [router.events, fetchAccommodations]); // Dependency on `router.events` and `fetchAccommodations`

  useEffect(() => {
    const handleAccommodationUpdated = () => {
      fetchAccommodations();
    };

    window.addEventListener('accommodation-updated', handleAccommodationUpdated);

    return () => {
      window.removeEventListener('accommodation-updated', handleAccommodationUpdated);
    };
  }, [fetchAccommodations]);

  const handleAddNew = () => {
    router.push('/admin/add');
  };

  if (loading || loadingData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="flex space-x-4 mb-4">
        <button onClick={handleAddNew} className="p-2 bg-green-500 text-white rounded">
          Add New Listing
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {accommodations.map((accommodation) => (
          <div key={accommodation.id} className="relative">
            <ListingCard {...accommodation} onClick={() => router.push('/')} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;