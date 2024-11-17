export interface Accommodation {
  userId: string | undefined;
  id: string;
  name: string;
  city: string;
  description: string;
  price: number;
  guests: number;
  rooms: number;
  images: string[];
  category?: string; // Add category field
}

export interface Booking {
  id: string;
  userId: string;
  accommodationId: string;
  startDate: string;
  endDate: string;
  guestCount: number;
  totalPrice: number;
  createdAt: string;
  image: string;
  name: string;
  city: string;
  status: string;
  rooms: number; // Lägg till rooms-fältet
}
