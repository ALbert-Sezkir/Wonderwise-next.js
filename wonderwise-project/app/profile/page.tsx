// 'use client'
// import Image from 'next/image';
// import React, { useState, useEffect } from 'react';
// import { FaPlus } from 'react-icons/fa';
// import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext to provide user info

// function ProfilePage() {
//   const { user, isAdmin } = useAuth(); // Assuming useAuth provides user and isAdmin
//   const [profilePic, setProfilePic] = useState('/images/placeholder.jpg');
//   const [name, setName] = useState('Your Name');
//   const [info, setInfo] = useState('Info about you');
//   const [location, setLocation] = useState('Your Location');
//   const [email, setEmail] = useState('your.email@example.com');
//   const [phone, setPhone] = useState('123-456-7890');
//   const [isEditing, setIsEditing] = useState(false);

//   const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setProfilePic(e.target?.result as string);
//       };
//       reader.readAsDataURL(e.target.files[0]);
//     }
//   };

//   const handleEditToggle = () => {
//     setIsEditing(!isEditing);
//   };

//   const handleSave = () => {
//     setIsEditing(false);
//     // Save the updated profile information to the database
//   };

//   return (
//     <div className="flex justify-center items-center h-screen p-4">
//       <div className="flex flex-col items-center w-full max-w-2xl">
//         <div className="relative mb-8">
//           <Image
//           width={200}
//           height={200}
//             src={profilePic}
//             alt="Profile"
//             className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-[#344E41]"
//           />
//           {user && (
//             <label htmlFor="profilePicInput" className="absolute right-0 bottom-0 bg-white p-2 rounded-full cursor-pointer border-2 border-black">
//               <FaPlus className="text-[#344E41]" />
//             </label>
//           )}
//           <input
//             id="profilePicInput"
//             type="file"
//             accept="image/*"
//             className="hidden"
//             onChange={handleProfilePicChange}
//           />
//         </div>
//         <div className="w-full bg-[#344E41] p-8 rounded-md text-white">
//           {isEditing ? (
//             <div className="flex flex-col gap-4">
//               <input
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="Name"
//                 className="p-2 rounded-md text-black w-full"
//               />
//               <input
//                 type="text"
//                 value={info}
//                 onChange={(e) => setInfo(e.target.value)}
//                 placeholder="Info about you"
//                 className="p-2 rounded-md text-black w-full text-center"
//               />
//               <input
//                 type="text"
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//                 placeholder="Location"
//                 className="p-2 rounded-md text-black w-full"
//               />
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Email"
//                 className="p-2 rounded-md text-black w-full"
//               />
//               <input
//                 type="tel"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 placeholder="Phone"
//                 className="p-2 rounded-md text-black w-full"
//               />
//               <div className="flex justify-center">
//                 <button
//                   onClick={handleSave}
//                   className="bg-white text-[#344E41] p-2 rounded-md mt-4"
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-col gap-4">
//               <div className="flex justify-between">
//                 <strong>Name</strong>
//                 <span>{name}</span>
//               </div>
//               <hr className="border-white" />
//               <div className="text-center">
//                 <strong>Info</strong>
//                 <div className="text-sm">{info}</div>
//               </div>
//               <hr className="border-white" />
//               <div className="flex justify-between">
//                 <strong>Location</strong>
//                 <span>{location}</span>
//               </div>
//               <hr className="border-white" />
//               <div className="flex justify-between">
//                 <strong>Email</strong>
//                 <span>{email}</span>
//               </div>
//               <hr className="border-white" />
//               <div className="flex justify-between">
//                 <strong>Phone</strong>
//                 <span>{phone}</span>
//               </div>
//               {user && (
//                 <div className="flex justify-center">
//                   <button
//                     onClick={handleEditToggle}
//                     className="bg-white text-[#344E41] p-2 rounded-md mt-4"
//                   >
//                     Edit
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProfilePage;

'use client'

import { useState } from "react";
import Image from "next/image";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { storage } from "../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function ProfilePage() {
  const { user } = useAuth();
  const [profilePic, setProfilePic] = useState('/images/placeholder.jpg');
  const [isUploading, setIsUploading] = useState(false);
  const [name, setName] = useState('Your Name');
  const [info, setInfo] = useState('Info about you');
  const [location, setLocation] = useState('Your Location');
  const [email, setEmail] = useState('your.email@example.com');
  const [phone, setPhone] = useState('123-456-7890');
  const [isEditing, setIsEditing] = useState(false);

  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && user) {
      const file = e.target.files[0];
      const storageRef = ref(storage, `profileImage/${user.uid}/${file.name}`);
      setIsUploading(true);

      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setProfilePic(downloadURL);
        setIsUploading(false);
      } catch (error) {
        console.error("Error uploading file:", error);
        setIsUploading(false);
      }
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save the updated profile information to the database
  };

  return (
    <div className="flex justify-center items-center h-screen p-4">
      <div className="flex flex-col items-center w-full max-w-2xl">
        <div className="relative mb-8">
          <Image
            width={200}
            height={200}
            src={profilePic}
            alt="Profile"
            className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-[#344E41]"
          />
          {user && (
            <label htmlFor="profilePicInput" className="absolute right-0 bottom-0 bg-white p-2 rounded-full cursor-pointer border-2 border-black">
              <FaPlus className="text-[#344E41]" />
            </label>
          )}
          <input
            id="profilePicInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfilePicChange}
          />
        </div>
        {isUploading && <p>Uploading...</p>}
        <div className="w-full bg-[#344E41] p-8 rounded-md text-white">
          {isEditing ? (
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="p-2 rounded-md text-black w-full"
              />
              <input
                type="text"
                value={info}
                onChange={(e) => setInfo(e.target.value)}
                placeholder="Info about you"
                className="p-2 rounded-md text-black w-full text-center"
              />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="p-2 rounded-md text-black w-full"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="p-2 rounded-md text-black w-full"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className="p-2 rounded-md text-black w-full"
              />
              <div className="flex justify-center">
                <button
                  onClick={handleSave}
                  className="bg-white text-[#344E41] p-2 rounded-md mt-4"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <strong>Name</strong>
                <span>{name}</span>
              </div>
              <hr className="border-white" />
              <div className="text-center">
                <strong>Info</strong>
                <div className="text-sm">{info}</div>
              </div>
              <hr className="border-white" />
              <div className="flex justify-between">
                <strong>Location</strong>
                <span>{location}</span>
              </div>
              <hr className="border-white" />
              <div className="flex justify-between">
                <strong>Email</strong>
                <span>{email}</span>
              </div>
              <hr className="border-white" />
              <div className="flex justify-between">
                <strong>Phone</strong>
                <span>{phone}</span>
              </div>
              {user && (
                <div className="flex justify-center">
                  <button
                    onClick={handleEditToggle}
                    className="bg-white text-[#344E41] p-2 rounded-md mt-4"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;