'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/firebaseConfig';
import { useAuth } from '../../context/AuthContext'


const AddAccommodation = () => {
  const router = useRouter();
  const { user } = useAuth(); // Get the logged-in user
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [guests, setGuests] = useState('');
  const [rooms, setRooms] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewImages([...newImages, ...filesArray]);
      const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...previewUrls]);
    }
  };

  const uploadImage = async (file: File) => {
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const uploadedImageUrls = await Promise.all(newImages.map(uploadImage));
    const newListing = {
      userId: user?.uid, // Add user ID to the listing
      name,
      city,
      description,
      price: Number(price),
      guests: Number(guests),
      rooms: Number(rooms),
      images: [...images, ...uploadedImageUrls]
    };
    try {
      await addDoc(collection(db, 'accommodations'), newListing);
      router.push('/admin');
    } catch (error) {
      console.error('Error adding new listing: ', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Add New Accommodation Listing</h1>
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
          <div className="space-y-2">
            <h3 className="font-semibold">Images</h3>
            {images.map((image, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder={`Image URL ${index + 1}`}
                  className="flex-grow p-2 border rounded"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-2 bg-red-500 text-white rounded"
                >
                  Remove
                </button>
              </div>
            ))}
            {/* <button
              type="button"
              onClick={handleAddImage}
              className="p-2 bg-green-500 text-white rounded"
            >
              Add Image URL
            </button> */}
            <input type="file" multiple onChange={handleFileChange} className="mt-2" />
            <div className="flex flex-wrap gap-2 mt-2">
              {previewImages.map((src, index) => (
                <img key={index} src={src} alt={`Preview ${index + 1}`} className="w-24 h-24 object-cover rounded" />
              ))}
            </div>
          </div>
          <div className="text-center mt-4">
            <button type="submit" className="p-2 bg-[#A3B18A] text-white rounded">
              Add Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccommodation;