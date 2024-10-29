'use client'

import React, { useState } from 'react';
import { db } from '../../firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const AdminForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [roomCount, setRoomCount] = useState('');
  const [bathroom, setBathroom] = useState('');
  const [guestCount, setGuestCount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newListing = {
      title,
      description,
      price,
      category,
      roomCount,
      bathroom,
      guestCount,
      createdAt: new Date()
    };
    try {
      const docRef = await addDoc(collection(db, "Listings"), newListing);
      console.log("Listing added with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding listing: ", error);
    }
  };

  return (
    <div>
      <h1>Add House Listing</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
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
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          required
        />
        <input
          type="number"
          value={roomCount}
          onChange={(e) => setRoomCount(e.target.value)}
          placeholder="Room Count"
          required
        />
        <input
          type="number"
          value={bathroom}
          onChange={(e) => setBathroom(e.target.value)}
          placeholder="Bathroom"
          required
        />
        <input
          type="number"
          value={guestCount}
          onChange={(e) => setGuestCount(e.target.value)}
          placeholder="Guest Count"
          required
        />
        <button type="submit">Add Listing</button>
      </form>
    </div>
  );
};

export default AdminForm;