'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, storage } from '@/firebaseConfig';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { useAuth } from '@/app/context/AuthContext';
import Image from 'next/image';
import { MdClose } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';
import crypto from 'crypto';
import { categories } from '@/components/Categories'; // Import categories
import CategoryModal from '@/components/CategoryModal'; // Import CategoryModal

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
  const [category, setCategory] = useState(null); // Add state for category
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false); // State for category modal
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
            setPreviewImages(data?.images || []); // Set previewImages from fetched data
            setUserId(data?.userId || null); // Set userId from the fetched data
            setCategory(data?.category || null); // Set category from the fetched data
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
    const updatedNewImages = newImages.filter((_, i) => i !== index);
    const updatedPreviewImages = previewImages.filter((_, i) => i !== index);
    setNewImages(updatedNewImages);
    setPreviewImages(updatedPreviewImages);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (filesArray.length + previewImages.length > 3) {
        toast.error('You can only upload 3 images.');
        return;
      }
      setNewImages([...newImages, ...filesArray]);
      const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...previewUrls]);
    }
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

  const uploadImage = async (file: File): Promise<string> => {
    const hash = await generateImageHash(file);
    const existingUrl = await checkIfImageExists(hash);
    if (existingUrl) {
      return existingUrl;
    } else {
      const storageRef = ref(storage, `images/${hash}`);
      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.dismiss(); // Reset toast state
    if (previewImages.length !== 3) {
      toast.error('You must have exactly 3 images.');
      return;
    }
    try {
      const uploadedImageUrls = await Promise.all(newImages.map(uploadImage));
      const updatedListing = {
        name,
        city,
        description,
        price: Number(price),
        guests: Number(guests),
        rooms: Number(rooms),
        category: category?.label, // Include category in the updated listing
        images: [...previewImages, ...uploadedImageUrls], // Use previewImages to maintain order
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
      toast.error('Error updating listing. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (typeof id === 'string') {
      try {
        await deleteDoc(doc(db, 'accommodations', id));
        router.push('/admin');
      } catch (error) {
        console.error('Error deleting listing: ', error);
        toast.error('Error deleting listing. Please try again.');
      }
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const lines = value.split('\n');
    if (value.length <= 310 && lines.length <= 4) {
      setDescription(value);
    }
  };

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('index', index.toString());
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    const draggedIndex = parseInt(e.dataTransfer.getData('index'), 10);
    const updatedPreviewImages = [...previewImages];
    const [draggedImage] = updatedPreviewImages.splice(draggedIndex, 1);
    updatedPreviewImages.splice(index, 0, draggedImage);
    setPreviewImages(updatedPreviewImages);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8" style={{ color: '#344E41' }}>
          Edit Listing
        </h1>
        <Toaster />
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
          <div className="relative">
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Description"
              className="w-full p-2 h-44 border rounded"
              required
            />
            <div className="absolute bottom-2 right-2 text-gray-500 text-sm">
              {description.length}/310
            </div>
          </div>
          {/* Category */}
          <div>
            <label className="font-livvic">Category</label>
            <div
              onClick={() => setCategoryModalOpen(true)}
              className="p-2 border rounded cursor-pointer"
            >
              {category ? category.label : "Choose a category"}
            </div>
          </div>
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
              {previewImages.map((src, index) => (
                <div
                  key={index}
                  className="relative"
                  draggable
                  onDragStart={(e) => onDragStart(e, index)}
                  onDrop={(e) => onDrop(e, index)}
                  onDragOver={onDragOver}
                >
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
            <input type="file" multiple onChange={handleFileChange} className="mt-2" />
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
        {/* Category Modal */}
        {isCategoryModalOpen && (
          <CategoryModal
            categories={categories}
            onSelectCategory={(category) => {
              setCategory(category);
              setCategoryModalOpen(false);
            }}
            onClose={() => setCategoryModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default EditAccommodation;