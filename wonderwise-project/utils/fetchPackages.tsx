import { useEffect, useState } from 'react';

import ListingCard from '../app/components/ListingCard';
import { Accommodation } from '@/types/package';
import fetchAccommodations from './fetchAccommodations';


const HomePage = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {accommodations.map((accommodation) => (
          <ListingCard key={accommodation.id} {...accommodation} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;