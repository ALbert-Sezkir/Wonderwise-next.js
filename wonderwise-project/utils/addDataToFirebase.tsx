import { Accommodation } from "../types/package";

const accommodations: Accommodation[] = [
  {
    id: "1",
    name: "Cozy Cottage",
    city: "Stockholm",
    description: "A cozy cottage in the heart of Stockholm.",
    price: 1200,
    guests: 4,
    images: ["image1.jpg", "image2.jpg"]
  },
  {
    id: "2",
    name: "Modern Apartment",
    city: "Gothenburg",
    description: "A modern apartment with all amenities.",
    price: 1500,
    guests: 2,
    images: ["image3.jpg", "image4.jpg"]
  },
  // Lägg till fler boenden här
];

export default accommodations;