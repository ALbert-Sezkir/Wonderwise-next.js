import { Accommodation } from '@/types/package';

export const filterListings = (
  listings: Accommodation[],
  guests: number,
  rooms: number,
  price: number
): Accommodation[] => {
  return listings.filter(
    (listing) =>
      listing.guests >= guests && listing.rooms >= rooms && listing.price <= price
  );
};