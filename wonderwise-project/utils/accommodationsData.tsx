// file: utils/accommodationsData.ts
import { ListingCardProps } from '../app/components/ListingCard';

const accommodations: ListingCardProps[] = [
  {
    id: "1",
    name: "Forest Retreat",
    city: "Umeå",
    description: "A peaceful retreat in the heart of the forest.",
    price: 1200,
    guests: 4,
    rooms: 2, // Added rooms field
    images: ["/images/forest_retreat_1.jpg", "/images/forest_retreat_2.jpg"]
  },
  {
    id: "2",
    name: "Mountain Cabin",
    city: "Åre",
    description: "A cozy cabin with stunning mountain views.",
    price: 1500,
    guests: 5,
    rooms: 3, // Added rooms field
    images: ["/images/mountain_cabin_1.jpg", "/images/mountain_cabin_2.jpg"]
  },
  {
    id: "3",
    name: "Lakeside Cottage",
    city: "Norrköping",
    description: "A cozy cabin surrounded by woodland.",
    price: 1300,
    guests: 4,
    rooms: 2, // Added rooms field
    images: ["/images/woodland_cabin_1.jpg", "/images/woodland_cabin_2.jpg"]
  },
  {
    id: "21",
    name: "Island Villa",
    city: "Stockholm Archipelago",
    description: "A luxurious villa on a private island.",
    price: 2600,
    guests: 8,
    rooms: 4, // Added rooms field
    images: ["/images/island_villa_1.jpg", "/images/island_villa_2.jpg"]
  },
  {
    id: "22",
    name: "Countryside Cottage",
    city: "Kalmar",
    description: "A quaint cottage in the countryside.",
    price: 1100,
    guests: 2,
    rooms: 1, // Added rooms field
    images: ["/images/countryside_cottage_1.jpg", "/images/countryside_cottage_2.jpg"]
  },
  {
    id: "23",
    name: "Hilltop Retreat",
    city: "Östersund",
    description: "A retreat on a hilltop with panoramic views.",
    price: 1900,
    guests: 5,
    rooms: 3, // Added rooms field
    images: ["/images/hilltop_retreat_1.jpg", "/images/hilltop_retreat_2.jpg"]
  },
  {
    id: "24",
    name: "Meadow Lodge",
    city: "Karlskrona",
    description: "A lodge in a beautiful meadow.",
    price: 1400,
    guests: 4,
    rooms: 2, // Added rooms field
    images: ["/images/meadow_lodge_1.jpg", "/images/meadow_lodge_2.jpg"]
  },
  {
    id: "25",
    name: "Cliffside Villa",
    city: "Visby",
    description: "A villa perched on a cliff with breathtaking views.",
    price: 2300,
    guests: 6,
    rooms: 4, // Added rooms field
    images: ["/images/cliffside_villa_1.jpg", "/images/cliffside_villa_2.jpg"]
  }
];

export default accommodations;