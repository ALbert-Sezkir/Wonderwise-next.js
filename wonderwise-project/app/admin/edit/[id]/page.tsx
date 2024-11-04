'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/firebaseConfig';

const EditAccommodation = () => {
  const router = useRouter();
  const { id } = useParams();

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [guests, setGuests] = useState('');
  const [rooms, setRooms] = useState('');
  const [images, setImages] = useState<string[]>(['']);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchAccommodation = async () => {
      if (id) {
        const docRef = doc(db, 'accommodations', id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name);
          setCity(data.city);
          setDescription(data.description);
          setPrice(data.price);
          setGuests(data.guests);
          setRooms(data.rooms || '');
          setImages(data.images || []);
        }
      }
    };

    fetchAccommodation();
  }, [id]);

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
    const updatedListing = {
      name,
      city,
      description,
      price: Number(price),
      guests: Number(guests),
      rooms: Number(rooms),
      images: [...images, ...uploadedImageUrls]
    };
    try {
      await setDoc(doc(db, 'accommodations', id as string), updatedListing);
      router.push('/admin');
    } catch (error) {
      console.error('Error updating listing: ', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8" style={{ color: '#344E41' }}>
          Edit Listing
        </h1>
        <div className="bg-[#344E41] p-8 rounded-md text-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded text-black"
                required
              />
            </div>
            <div>
              <label className="block mb-2">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2 border rounded text-black"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded text-black"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Guests</label>
              <input
                type="number"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full p-2 border rounded text-black"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Rooms</label>
              <input
                type="number"
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                className="w-full p-2 border rounded text-black"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 border rounded text-black"
                required
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Images</h3>
              {images.map((image, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder={`Image URL ${index + 1}`}
                    className="flex-grow p-2 border rounded text-black"
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
              <input type="file" multiple onChange={handleFileChange} className="mt-2" />
              <div className="flex flex-wrap gap-2 mt-2">
                {previewImages.map((src, index) => (
                  <img key={index} src={src} alt={`Preview ${index + 1}`} className="w-24 h-24 object-cover rounded" />
                ))}
              </div>
            </div>
            <div className="text-center mt-4">
              <button type="submit" className="p-2 bg-[#A3B18A] text-white rounded">
                Update Listing
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAccommodation;