import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '@/firebaseConfig';

const EditForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [guests, setGuests] = useState('');
  const [rooms, setRooms] = useState(''); // Ensure rooms is initialized with an empty string
  const [images, setImages] = useState('');

  useEffect(() => {
    const fetchAccommodation = async () => {
      if (id) {
        const docRef = doc(db, "accommodations", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name);
          setCity(data.city);
          setDescription(data.description);
          setPrice(data.price);
          setGuests(data.guests);
          setRooms(data.rooms || ''); // Ensure rooms is not undefined
          setImages(data.images || []);
        }
      }
    };

    fetchAccommodation();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedListing = {
      name,
      city,
      description,
      price: Number(price),
      guests: Number(guests),
      rooms: Number(rooms), // Ensure rooms is included
      images
    };
    try {
      await setDoc(doc(db, "accommodations", id as string), updatedListing);
      console.log("Listing updated:", updatedListing);
      router.push('/admin');
    } catch (error) {
      console.error("Error updating listing: ", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Accommodation Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg shadow-md bg-white">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          placeholder="Guests"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
          placeholder="Rooms"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          value={images}
          onChange={(e) => setImages(e.target.value)}
          placeholder="Images"
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Update Listing
        </button>
      </form>
    </div>
  );
};

export default EditForm;