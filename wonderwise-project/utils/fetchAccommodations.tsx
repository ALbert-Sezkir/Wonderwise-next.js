// file: utils/fetchAccommodations.tsx
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Accommodation } from '@/types/package';

const fetchAccommodations = async (): Promise<Accommodation[]> => {
  const querySnapshot = await getDocs(collection(db, 'accommodations'));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    rooms: doc.data().rooms || 0,
    guests: doc.data().guests || 0,
    price: doc.data().price || 0,
    name: doc.data().name || '',
    city: doc.data().city || '',
    description: doc.data().description || '',
    images: doc.data().images || [],
  }));
};

export default fetchAccommodations;