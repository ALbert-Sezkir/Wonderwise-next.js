// 'use client'

// import Link from 'next/link';
// import { useState, useEffect } from 'react';
// import { collection, getDocs } from "firebase/firestore";
// import { db } from '@/firebaseConfig';

// const AdminPage = () => {
//   const [accommodations, setAccommodations] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Funktion för att hämta boenden från Firestore
//   const fetchAccommodations = async () => {
//     setLoading(true);
//     try {
//       const querySnapshot = await getDocs(collection(db, "accommodations"));
//       const accommodationsData = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setAccommodations(accommodationsData);
//     } catch (error) {
//       console.error("Error fetching accommodations:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Hämta data vid laddning av sidan
//   useEffect(() => {
//     fetchAccommodations();
//   }, []);

//   return (
//     <div className="p-4">
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="flex flex-wrap -mx-2">
//           {accommodations.length > 0 ? (
//             accommodations.map((accommodation) => (
//               <div key={accommodation.id} className="w-full md:w-1/2 lg:w-1/3 px-2 mb-4">
//                 <div className="border rounded-lg p-4 bg-white shadow-md h-full flex flex-col">
//                   <div className="mb-4">
//                     <h3 className="text-xl font-bold mb-2">{accommodation.name}</h3>
//                     {accommodation.images && accommodation.images.length > 0 ? (
//                       <div>
//                         <img
//                           src={accommodation.images[0]}
//                           alt={`Main image of ${accommodation.name}`}
//                           className="w-full h-80 object-cover rounded mb-2" // Adjusted height to h-64
//                         />
//                         <div className="flex flex-wrap gap-2">
//                           {accommodation.images.slice(1).map((image: string, index: number) => (
//                             <img
//                               key={index}
//                               src={image}
//                               alt={`Thumbnail ${index + 1} of ${accommodation.name}`}
//                               className="w-24 h-24 object-cover rounded"
//                             />
//                           ))}
//                         </div>
//                       </div>
//                     ) : (
//                       <p>No images available</p>
//                     )}
//                   </div>
//                   <p className="mb-1">City: {accommodation.city}</p>
//                   <p className="mb-1">Price: ${accommodation.price}</p>
//                   <p className="mb-1">Guests: {accommodation.guests}</p>
//                   <p className="mb-2">Description: {accommodation.description}</p>
//                   <div className="mt-auto">
//                     <Link href={`/admin/edit/${accommodation.id}`}>
//                       <button className="border border-blue-500 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
//                         Edit
//                       </button>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p>No accommodations available</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminPage;

'use client'

import AccommodationsList from "../components/AccommodationsList";



const AdminPage = () => {
  return (
    <div className="p-4">
      <AccommodationsList showEditButton={true} />
    </div>
  );
};

export default AdminPage;