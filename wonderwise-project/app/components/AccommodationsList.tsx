'use client'

import { useEffect, useState } from 'react';
import ListingCard, { ListingCardProps } from './ListingCard';
import fetchAccommodations from '@/utils/fetchAccommodations';
import { useSearch } from '../context/SearchContext';
import { filterListings } from '@/utils/filterListings';
import SkeletonLoader from './SkeletonLoader';

const AccommodationsList = () => {
  const { searchParams, isSearchActive } = useSearch();
  const [accommodations, setAccommodations] = useState<ListingCardProps[]>([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState<ListingCardProps[]>([]);
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

  useEffect(() => {
    if (isSearchActive) {
      const filtered = filterListings(accommodations, searchParams);
      setFilteredAccommodations(filtered);
    } else {
      setFilteredAccommodations(accommodations);
    }
  }, [accommodations, searchParams, isSearchActive]);

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredAccommodations.map((accommodation) => (
        <ListingCard key={accommodation.id} {...accommodation} />
      ))}
    </div>
  );
};

export default AccommodationsList;