// // file: app/admin/edit/[id]/page.tsx
// 'use client'

// import React, { useState, useEffect } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { db, storage } from '@/firebaseConfig';

// const EditAccommodation = () => {
//   const router = useRouter();
//   const { id } = useParams(); // This will now be the document ID

//   const [name, setName] = useState('');
//   const [city, setCity] = useState('');
//   const [description, setDescription] = useState('');
//   const [price, setPrice] = useState('');
//   const [guests, setGuests] = useState('');
//   const [images, setImages] = useState<string[]>(['']);
//   const [newImages, setNewImages] = useState<File[]>([]);

//   useEffect(() => {
//     const fetchAccommodation = async () => {
//       if (id) {
//         const docRef = doc(db, "accommodations", id as string);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           setName(data.name);
//           setCity(data.city);
//           setDescription(data.description);
//           setPrice(data.price);
//           setGuests(data.guests);
//           setImages(data.images || []);
//         }
//       }
//     };

//     fetchAccommodation();
//   }, [id]);

//   const handleImageChange = (index: number, value: string) => {
//     const newImages = [...images];
//     newImages[index] = value;
//     setImages(newImages);
//   };

//   const handleAddImage = () => {
//     setImages([...images, '']);
//   };

//   const handleRemoveImage = (index: number) => {
//     const newImages = images.filter((_, i) => i !== index);
//     setImages(newImages);
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setNewImages([...newImages, ...Array.from(e.target.files)]);
//     }
//   };

//   const uploadImage = async (file: File) => {
//     const storageRef = ref(storage, `images/${file.name}`);
//     await uploadBytes(storageRef, file);
//     return getDownloadURL(storageRef);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const uploadedImageUrls = await Promise.all(newImages.map(uploadImage));
    
//     // Uppdatera images tillståndet med nya bilder direkt
//     setImages(prevImages => [...prevImages, ...uploadedImageUrls]);
  
//     const updatedListing = {
//       name,
//       city,
//       description,
//       price: Number(price),
//       guests: Number(guests),
//       images: [...images, ...uploadedImageUrls] // Uppdaterade images-URLer
//     };
  
//     try {
//       await setDoc(doc(db, "accommodations", id as string), updatedListing);
//       console.log("Listing updated:", updatedListing);
//       router.push('/');
//     } catch (error) {
//       console.error("Error updating listing: ", error);
//     }
//   };
  

//   return (
//     <div>
//       <h1>Edit Accommodation Listing</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="Name"
//           required
//         />
//         <input
//           type="text"
//           value={city}
//           onChange={(e) => setCity(e.target.value)}
//           placeholder="City"
//           required
//         />
//         <textarea
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Description"
//           required
//         />
//         <input
//           type="number"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           placeholder="Price"
//           required
//         />
//         <input
//           type="number"
//           value={guests}
//           onChange={(e) => setGuests(e.target.value)}
//           placeholder="Guests"
//           required
//         />
//         <div>
//           <h3>Images</h3>
//           {images.map((image, index) => (
//             <div key={index}>
//               <input
//                 type="text"
//                 value={image}
//                 onChange={(e) => handleImageChange(index, e.target.value)}
//                 placeholder={`Image URL ${index + 1}`}
//                 required
//               />
//               <button type="button" onClick={() => handleRemoveImage(index)}>Remove</button>
//             </div>
//           ))}
//           <button type="button" onClick={handleAddImage}>Add Image</button>
//           <input type="file" multiple onChange={handleFileChange} />
//         </div>
//         <button type="submit">Update Listing</button>
//       </form>
//     </div>
//   );
// };

// export default EditAccommodation;

// file: app/admin/edit/[id]/page.tsx



// 'use client'

// import React, { useState, useEffect } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { db, storage } from '@/firebaseConfig';

// const EditAccommodation = () => {
//   const router = useRouter();
//   const { id } = useParams();

//   const [name, setName] = useState('');
//   const [city, setCity] = useState('');
//   const [description, setDescription] = useState('');
//   const [price, setPrice] = useState('');
//   const [guests, setGuests] = useState('');
//   const [images, setImages] = useState<string[]>(['']);
//   const [newImages, setNewImages] = useState<File[]>([]);

//   useEffect(() => {
//     const fetchAccommodation = async () => {
//       if (id) {
//         const docRef = doc(db, "accommodations", id as string);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           setName(data.name);
//           setCity(data.city);
//           setDescription(data.description);
//           setPrice(data.price);
//           setGuests(data.guests);
//           setImages(data.images || []);
//         }
//       }
//     };

//     fetchAccommodation();
//   }, [id]);

//   const handleImageChange = (index: number, value: string) => {
//     const newImages = [...images];
//     newImages[index] = value;
//     setImages(newImages);
//   };

//   const handleAddImage = () => {
//     setImages([...images, '']);
//   };

//   const handleRemoveImage = (index: number) => {
//     const newImages = images.filter((_, i) => i !== index);
//     setImages(newImages);
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setNewImages([...newImages, ...Array.from(e.target.files)]);
//     }
//   };

//   const uploadImage = async (file: File) => {
//     const storageRef = ref(storage, `images/${file.name}`);
//     await uploadBytes(storageRef, file);
//     return getDownloadURL(storageRef);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const uploadedImageUrls = await Promise.all(newImages.map(uploadImage));

//     // Uppdatera images tillståndet med nya bilder direkt
//     setImages(prevImages => [...prevImages, ...uploadedImageUrls]);

//     const updatedListing = {
//       name,
//       city,
//       description,
//       price: Number(price),
//       guests: Number(guests),
//       images: [...images, ...uploadedImageUrls] // Uppdaterade images-URLer
//     };

//     try {
//       await setDoc(doc(db, "accommodations", id as string), updatedListing);
//       console.log("Listing updated:", updatedListing);
//       router.push('/admin'); // Navigera tillbaka till admin-sidan efter uppdatering
//     } catch (error) {
//       console.error("Error updating listing: ", error);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Edit Accommodation Listing</h1>
//       <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg shadow-md bg-white">
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="Name"
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="text"
//           value={city}
//           onChange={(e) => setCity(e.target.value)}
//           placeholder="City"
//           className="w-full p-2 border rounded"
//           required
//         />
//         <textarea
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Description"
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="number"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           placeholder="Price"
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="number"
//           value={guests}
//           onChange={(e) => setGuests(e.target.value)}
//           placeholder="Guests"
//           className="w-full p-2 border rounded"
//           required
//         />
//         <div className="space-y-2">
//           <h3 className="font-semibold">Images</h3>
//           {images.map((image, index) => (
//             <div key={index} className="flex items-center space-x-2">
//               <input
//                 type="text"
//                 value={image}
//                 onChange={(e) => handleImageChange(index, e.target.value)}
//                 placeholder={`Image URL ${index + 1}`}
//                 className="flex-grow p-2 border rounded"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => handleRemoveImage(index)}
//                 className="bg-red-500 text-white p-2 rounded"
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={handleAddImage}
//             className="bg-green-500 text-white p-2 rounded"
//           >
//             Add Image URL
//           </button>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileChange}
//             multiple
//             className="p-2 border rounded"
//           />
//         </div>
//         <button
//           type="submit"
//           className="bg-blue-500 text-white p-2 rounded"
//         >
//           Update Accommodation
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditAccommodation;

// file: app/admin/edit/[id]/page.tsx
// file: app/admin/edit/[id]/page.tsx
// file: app/admin/edit/[id]/page.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from '@/firebaseConfig';

const EditAccommodation = () => {
  const router = useRouter();
  const { id } = useParams();

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [guests, setGuests] = useState('');
  const [images, setImages] = useState<string[]>(['']);
  const [newImages, setNewImages] = useState<File[]>([]);

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

  const handleAddImage = () => {
    setImages([...images, '']);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages([...newImages, ...Array.from(e.target.files)]);
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
      images: [...images, ...uploadedImageUrls]
    };
    try {
      await setDoc(doc(db, "accommodations", id as string), updatedListing);
      console.log("Listing updated:", updatedListing);
      router.push('/admin'); // Navigate back to admin page after updating
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
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
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
          <button
            type="button"
            onClick={handleAddImage}
            className="p-2 bg-green-500 text-white rounded"
          >
            Add Image
          </button>
          <input type="file" multiple onChange={handleFileChange} />
        </div>
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Update Listing
        </button>
      </form>
    </div>
  );
};

export default EditAccommodation;

