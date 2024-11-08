// // 'use client';

// // import React, { useState } from 'react';
// // import { useRouter } from 'next/navigation';
// // import { collection, addDoc } from 'firebase/firestore';
// // import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// // import { db, storage } from '@/firebaseConfig';
// // import { useAuth } from '../../context/AuthContext';
// // import Image from 'next/image'; // Correct import for Image component

// // const AddAccommodation = () => {
// //   const router = useRouter();
// //   const { user } = useAuth(); // Get the logged-in user
// //   const [name, setName] = useState('');
// //   const [city, setCity] = useState('');
// //   const [description, setDescription] = useState('');
// //   const [price, setPrice] = useState('');
// //   const [guests, setGuests] = useState('');
// //   const [rooms, setRooms] = useState('');
// //   const [images, setImages] = useState<string[]>([]);
// //   const [newImages, setNewImages] = useState<File[]>([]);
// //   const [previewImages, setPreviewImages] = useState<string[]>([]);

// //   const handleImageChange = (index: number, value: string) => {
// //     const newImages = [...images];
// //     newImages[index] = value;
// //     setImages(newImages);
// //   };

// //   const handleRemoveImage = (index: number) => {
// //     const newImages = images.filter((_, i) => i !== index);
// //     setImages(newImages);
// //   };

// //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     if (e.target.files) {
// //       const filesArray = Array.from(e.target.files);
// //       setNewImages([...newImages, ...filesArray]);
// //       const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
// //       setPreviewImages([...previewImages, ...previewUrls]);
// //     }
// //   };

// //   const uploadImage = async (file: File) => {
// //     const storageRef = ref(storage, `images/${file.name}`);
// //     console.log('Uploading file:', file.name);
// //     await uploadBytes(storageRef, file);
// //     const downloadURL = await getDownloadURL(storageRef, file);
// //     console.log('File uploaded, download URL:', downloadURL);
// //     return downloadURL;
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     const uploadedImageUrls = await Promise.all(newImages.map(uploadImage));
// //     const newListing = {
// //       userId: user?.uid, // Add user ID to the listing
// //       name,
// //       city,
// //       description,
// //       price: Number(price),
// //       guests: Number(guests),
// //       rooms: Number(rooms),
// //       images: [...images, ...uploadedImageUrls]
// //     };
// //     try {
// //       await addDoc(collection(db, 'accommodations'), newListing);
// //       router.push('/admin');
// //     } catch (error) {
// //       console.error('Error adding new listing: ', error);
// //     }
// //   };

// //   return (
// //     <div className="flex justify-center items-center min-h-screen p-4">
// //       <div className="w-full max-w-2xl">
// //         <h1 className="text-2xl font-bold mb-4 text-center">Add New Accommodation Listing</h1>
// //         <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg shadow-md bg-white">
// //           <input
// //             type="text"
// //             value={name}
// //             onChange={(e) => setName(e.target.value)}
// //             placeholder="Name"
// //             className="w-full p-2 border rounded"
// //             required
// //           />
// //           <input
// //             type="text"
// //             value={city}
// //             onChange={(e) => setCity(e.target.value)}
// //             placeholder="City"
// //             className="w-full p-2 border rounded"
// //             required
// //           />
// //           <textarea
// //             value={description}
// //             onChange={(e) => setDescription(e.target.value)}
// //             placeholder="Description"
// //             className="w-full p-2 border rounded"
// //             required
// //           />
// //           <input
// //             type="number"
// //             value={guests}
// //             onChange={(e) => setGuests(e.target.value)}
// //             placeholder="Guests"
// //             className="w-full p-2 border rounded"
// //             required
// //           />
// //           <input
// //             type="number"
// //             value={rooms}
// //             onChange={(e) => setRooms(e.target.value)}
// //             placeholder="Rooms"
// //             className="w-full p-2 border rounded"
// //             required
// //           />
// //           <input
// //             type="number"
// //             value={price}
// //             onChange={(e) => setPrice(e.target.value)}
// //             placeholder="Price"
// //             className="w-full p-2 border rounded"
// //             required
// //           />
// //           <div className="space-y-2">
// //             <h3 className="font-semibold">Images</h3>
// //             {images.map((image, index) => (
// //               <div key={index} className="flex items-center space-x-2">
// //                 <input
// //                   type="text"
// //                   value={image}
// //                   onChange={(e) => handleImageChange(index, e.target.value)}
// //                   placeholder={`Image URL ${index + 1}`}
// //                   className="flex-grow p-2 border rounded text-black"
// //                   required
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => handleRemoveImage(index)}
// //                   className="p-2 bg-red-500 text-white rounded"
// //                 >
// //                   Remove
// //                 </button>
// //               </div>
// //             ))}
// //             <input type="file" multiple onChange={handleFileChange} className="mt-2" />
// //             <div className="flex flex-wrap gap-2 mt-2">
// //               {previewImages.length > 0 ? (
// //                 previewImages.map((src, index) => (
// //                   <Image key={index} src={src}  alt={`Preview ${index + 1}`} width={96} height={96} className="w-24 h-24 object-cover rounded" />
// //                 ))
// //               ) : (
// //                 <Image src="/No_Image.jpg" alt="No Image" width={96} height={96} className="w-24 h-24 object-cover rounded" />
// //               )}
// //             </div>
// //           </div>
// //           <div className="text-center mt-4">
// //             <button type="submit" className="p-2 bg-[#A3B18A] text-white rounded">
// //               Add Listing
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AddAccommodation;

// // file: AddAccommodation.tsx
// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { collection, addDoc } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { db, storage } from '@/firebaseConfig';
// import { useAuth } from '../../context/AuthContext';
// import Image from 'next/image';

// const AddAccommodation = () => {
//   const router = useRouter();
//   const { user } = useAuth();
//   const [name, setName] = useState('');
//   const [city, setCity] = useState('');
//   const [description, setDescription] = useState('');
//   const [price, setPrice] = useState('');
//   const [guests, setGuests] = useState('');
//   const [rooms, setRooms] = useState('');
//   const [images, setImages] = useState<string[]>([]);
//   const [newImages, setNewImages] = useState<File[]>([]);
//   const [previewImages, setPreviewImages] = useState<string[]>([]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const filesArray = Array.from(e.target.files);
//       setNewImages([...newImages, ...filesArray]);
//       const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
//       setPreviewImages([...previewImages, ...previewUrls]);
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
//     const newListing = {
//       userId: user?.uid,
//       name,
//       city,
//       description,
//       price: Number(price),
//       guests: Number(guests),
//       rooms: Number(rooms),
//       images: [...images, ...uploadedImageUrls]
//     };
//     try {
//       await addDoc(collection(db, 'accommodations'), newListing);
//       router.push('/admin');
//     } catch (error) {
//       console.error('Error adding new listing: ', error);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen p-4">
//       <div className="w-full max-w-2xl">
//         <h1 className="text-2xl font-bold mb-4 text-center">Add New Accommodation Listing</h1>
//         <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg shadow-md bg-white">
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Name"
//             className="w-full p-2 border rounded"
//             required
//           />
//           <input
//             type="text"
//             value={city}
//             onChange={(e) => setCity(e.target.value)}
//             placeholder="City"
//             className="w-full p-2 border rounded"
//             required
//           />
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Description"
//             className="w-full p-2 border rounded"
//             required
//           />
//           <input
//             type="number"
//             value={guests}
//             onChange={(e) => setGuests(e.target.value)}
//             placeholder="Guests"
//             className="w-full p-2 border rounded"
//             required
//           />
//           <input
//             type="number"
//             value={rooms}
//             onChange={(e) => setRooms(e.target.value)}
//             placeholder="Rooms"
//             className="w-full p-2 border rounded"
//             required
//           />
//           <input
//             type="number"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             placeholder="Price"
//             className="w-full p-2 border rounded"
//             required
//           />
//           <input type="file" multiple onChange={handleFileChange} className="mt-2" />
//           <div className="flex flex-wrap gap-2 mt-2">
//             {previewImages.map((src, index) => (
//               <Image key={index} src={src} alt={`Preview ${index + 1}`} width={96} height={96} className="w-24 h-24 object-cover rounded" />
//             ))}
//           </div>
//           <div className="text-center mt-4">
//             <button type="submit" className="p-2 bg-[#A3B18A] text-white rounded">
//               Add Listing
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddAccommodation;


// file: app/admin/add/page.tsx
// file: app/admin/add/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { db, storage } from '@/firebaseConfig';
import { useAuth } from '../../context/AuthContext';
import Image from 'next/image';
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
  const [images, setImages] = useState<string[]>([]);
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
        images: [...images, ...uploadedImageUrls]
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
          <input type="file" multiple onChange={handleFileChange} className="mt-2" />
          <div className="flex flex-wrap gap-2 mt-2">
            {previewImages.map((src, index) => (
              <Image key={index} src={src} alt={`Preview ${index + 1}`} width={96} height={96} className="w-24 h-24 object-cover rounded" />
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