// file: app/components/editAccommondationForm.tsx
'use client'

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
          setImages(data.images.join(', '));
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
      images: images.split(',').map(image => image.trim())
    };
    try {
      await setDoc(doc(db, "accommodations", id as string), updatedListing);
      console.log("Listing updated:", updatedListing);
      router.push('/');
    } catch (error) {
      console.error("Error updating listing: ", error);
    }
  };

  return (
    <div>
      <h1>Edit Accommodation Listing</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          required
        />
        <input
          type="number"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          placeholder="Guests"
          required
        />
        <input
          type="text"
          value={images}
          onChange={(e) => setImages(e.target.value)}
          placeholder="Images (comma separated URLs)"
          required
        />
        <button type="submit">Update Listing</button>
      </form>
    </div>
  );
};

export default EditForm;