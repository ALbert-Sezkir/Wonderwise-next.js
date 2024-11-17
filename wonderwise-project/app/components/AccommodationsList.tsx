'use client'

import { useEffect, useState } from 'react';
import ListingCard, { ListingCardProps } from './ListingCard';
import fetchAccommodations from '@/utils/fetchAccommodations';

const AccommodationsList = () => {
  const [accommodations, setAccommodations] = useState<ListingCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAccommodations = async () => {
      try {
        const data = await fetchAccommodations();
        setAccommodations(data);
      } catch (error) {
        console.error('Error fetching accommodations: ', error);
      } finally {
        setLoading(false);
      }
    };

    getAccommodations();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {accommodations.map((accommodation) => (
        <ListingCard key={accommodation.id} {...accommodation} />
      ))}
    </div>
  );
};

export default AccommodationsList;