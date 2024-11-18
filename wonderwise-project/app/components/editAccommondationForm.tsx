import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '@/firebaseConfig';
import { categories } from '@/components/Categories'; // Import categories
import CategoryModal from '@/components/CategoryModal'; // Import CategoryModal

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
  const [category, setCategory] = useState<{ label: string } | null>(null); // Add state for category
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false); // State for category modal

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
          setCategory(data.category ? { label: data.category } : null); // Set category from the fetched data
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
      images,
      category: category?.label || null, // Include category in the updated listing
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
        <input
          type="text"
          value={images}
          onChange={(e) => setImages(e.target.value)}
          placeholder="Images (comma separated URLs)"
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Update Listing
        </button>
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
  );
};

export default EditForm;