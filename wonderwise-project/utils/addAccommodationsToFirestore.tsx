// file: utils/addAccommodationsToFirestore.tsx
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import accommodations from "./accommodationsData";
import { ListingCardProps } from "../app/components/ListingCard";

const addAccommodationsToFirestore = async () => {
  const accommodationsCollection = collection(db, "accommodations");

  for (const accommodation of accommodations) {
    try {
      await addDoc(accommodationsCollection, accommodation);
      console.log(`Added accommodation with ID: ${accommodation.id}`);
    } catch (error) {
      console.error("Error adding accommodation: ", error);
    }
  }
};

export default addAccommodationsToFirestore;