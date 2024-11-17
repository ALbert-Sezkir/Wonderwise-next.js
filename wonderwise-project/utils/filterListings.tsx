import { Accommodation } from '@/types/package';

export const filterListings = (
  listings: Accommodation[],
  searchParams: {
    destination: string;
    category: string | null;
    guests: number;
    maxPrice: string;
    dateRange: { startDate: Date; endDate: Date }[];
    searchTerm: string;
  }
): Accommodation[] => {
  return listings.filter((listing) => {
    const matchesDestination = searchParams.destination
      ? listing.city.toLowerCase().includes(searchParams.destination.toLowerCase())
      : true;
    const matchesCategory = searchParams.category
      ? listing.category === searchParams.category
      : true;
    const matchesGuests = listing.guests >= searchParams.guests;
    const matchesPrice = searchParams.maxPrice
      ? listing.price <= parseFloat(searchParams.maxPrice)
      : true;
    const matchesSearchTerm = searchParams.searchTerm
      ? listing.name.toLowerCase().includes(searchParams.searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchParams.searchTerm.toLowerCase()) ||
        listing.city.toLowerCase().includes(searchParams.searchTerm.toLowerCase())
      : true;
    // Add date range filtering logic if needed

    return matchesDestination && matchesCategory && matchesGuests && matchesPrice && matchesSearchTerm;
  });
};