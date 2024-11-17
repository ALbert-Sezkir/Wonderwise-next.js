'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { db, storage } from '@/firebaseConfig';
import { useAuth } from '../../context/AuthContext';
import Image from 'next/image';
import { MdClose } from 'react-icons/md';
import crypto from 'crypto';

const AddAccommodation = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [guests, setGuests] = useState('');
  const [rooms, setRooms] = useState('');

  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewImages([...newImages, ...filesArray]);
      const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...previewUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedNewImages = newImages.filter((_, i) => i !== index);
    const updatedPreviewImages = previewImages.filter((_, i) => i !== index);
    setNewImages(updatedNewImages);
    setPreviewImages(updatedPreviewImages);
  };

  const generateImageHash = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const buffer = reader.result as ArrayBuffer;
        const hash = crypto.createHash('sha256').update(new Uint8Array(buffer)).digest('hex');
        resolve(hash);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const checkIfImageExists = async (hash: string): Promise<string | null> => {
    const listRef = ref(storage, 'images/');
    const listResult = await listAll(listRef);
    for (const itemRef of listResult.items) {
      if (itemRef.name === hash) {
        return getDownloadURL(itemRef);
      }
    }
    return null;
  };

  const uploadImage = async (file: File, hash: string): Promise<string> => {
    const storageRef = ref(storage, `images/${hash}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state
    setIsUploading(true);
    try {
      const uploadedImageUrls = await Promise.all(
        newImages.map(async (file) => {
          const hash = await generateImageHash(file);
          const existingUrl = await checkIfImageExists(hash);
          if (existingUrl) {
            return existingUrl;
          } else {
            return uploadImage(file, hash);
          }
        })
      );
      const newListing = {
        userId: user?.uid,
        name,
        city,
        description,
        price: Number(price),
        guests: Number(guests),
        rooms: Number(rooms),
        images: uploadedImageUrls
      };
      await addDoc(collection(db, 'accommodations'), newListing);
      router.push('/admin');
    } catch (error) {
      console.error('Error adding new listing:', error);
      setError('Error adding new listing. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Add New Accommodation Listing</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
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
            className="w-full p-2 h-44 border rounded"
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
          <input type="file" multiple onChange={handleFileChange} className="mt-2" />
          <div className="flex flex-wrap gap-2 mt-2">
            {previewImages.map((src, index) => (
              <div key={index} className="relative">
                <Image src={src} alt={`Preview ${index + 1}`} width={96} height={96} className="w-28 h-28 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                >
                  <MdClose size={20} />
                </button>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <button type="submit" className="p-2 bg-[#A3B18A] text-white rounded" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Add Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccommodation;