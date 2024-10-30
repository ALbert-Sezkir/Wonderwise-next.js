// file: utils/fetchAccommodations.tsx
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { ListingCardProps } from "../app/components/ListingCard";

const fetchAccommodations = async (): Promise<ListingCardProps[]> => {
  const accommodationsCollection = collection(db, "accommodations");
  const accommodationsSnapshot = await getDocs(accommodationsCollection);
  const accommodationsList = accommodationsSnapshot.docs.map(doc => ({
    id: doc.id, // Use document ID
    ...doc.data()
  })) as ListingCardProps[];
  return accommodationsList;
};

export default fetchAccommodations;