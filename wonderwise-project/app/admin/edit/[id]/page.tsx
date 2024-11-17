'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, storage } from '@/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/app/context/AuthContext';
import Image from 'next/image';
import { MdClose } from 'react-icons/md';

const EditAccommodation = () => {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [guests, setGuests] = useState('');
  const [rooms, setRooms] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null); // Add state for userId

  useEffect(() => {
    const fetchAccommodation = async () => {
      if (id) {
        try {
          const docRef = doc(db, 'accommodations', id as string);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setName(data?.name || '');
            setCity(data?.city || '');
            setDescription(data?.description || '');
            setPrice(data?.price?.toString() || '');
            setGuests(data?.guests?.toString() || '');
            setRooms(data?.rooms?.toString() || '');
            setImages(data?.images || []);
            setUserId(data?.userId || null); // Set userId from the fetched data
          }
        } catch (error) {
          console.error('Error fetching accommodation:', error);
        }
      }
    };
    fetchAccommodation();
  }, [id]);


  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
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
    try {
      const uploadedImageUrls = await Promise.all(newImages.map(uploadImage));
      const updatedListing = {
        name,
        city,
        description,
        price: Number(price),
        guests: Number(guests),
        rooms: Number(rooms),
        images: [...images, ...uploadedImageUrls],
        userId: userId || user?.uid, // Ensure userId is included
      };
      if (id) {
        if (typeof id === 'string') {
          await setDoc(doc(db, 'accommodations', id), updatedListing);
        }
      }
      router.push('/admin');
    } catch (error) {
      console.error('Error updating listing:', error);
    }
  };

  const handleDelete = async () => {
    if (typeof id === 'string') {
      try {
        await deleteDoc(doc(db, 'accommodations', id));
        router.push('/admin');
      } catch (error) {
        console.error('Error deleting listing: ', error);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8" style={{ color: '#344E41' }}>
          Edit Listing
        </h1>
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
          <div className="space-y-2">
            <h3 className="font-semibold">Images</h3>
            <div className="flex flex-wrap gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <Image src={image} alt={`Image ${index + 1}`} width={96} height={96} className="w-28 h-28 object-cover rounded" />
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
            <input type="file" multiple onChange={handleFileChange} className="mt-2" />
            <div className="flex flex-wrap gap-2 mt-2">
              {previewImages.map((src, index) => (
                <div key={index} className="relative">
                  <Image src={src} alt={`Preview ${index + 1}`} width={96} height={96} className="w-24 h-24 object-cover rounded" />
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
          </div>
          <div className="text-center mt-4">
            <button type="submit" className="p-2 bg-[#A3B18A] text-white rounded">
              Update Listing
            </button>
          </div>
          <div className="text-center mt-4">
            <button type="button" onClick={handleDelete} className="p-2 bg-red-500 text-white rounded">
              Delete Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAccommodation;