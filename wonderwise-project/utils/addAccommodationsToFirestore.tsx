// file: utils/addAccommodationsToFirestore.tsx
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import accommodations from "./accommodationsData";

const addAccommodationsToFirestore = async (userId: string) => {
  const accommodationsCollection = collection(db, "accommodations");

  for (const accommodation of accommodations) {
    try {
      await addDoc(accommodationsCollection, {
        ...accommodation,
        userId, 
      });
      console.log(`Added accommodation with ID: ${accommodation.id}`);
    } catch (error) {
      console.error("Error adding accommodation: ", error);
    }
  }
};

export default addAccommodationsToFirestore;