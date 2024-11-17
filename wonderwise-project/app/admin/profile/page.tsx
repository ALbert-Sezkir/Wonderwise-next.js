
'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaPlus } from 'react-icons/fa';
import { updateProfile as firebaseUpdateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { storage, db } from '@/firebaseConfig';
import { useAuth } from '@/app/context/AuthContext';

const AdminProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(user?.photoURL || '/images/No_image.jpg');
  const [name, setName] = useState(user?.displayName || '');
  const [info, setInfo] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.displayName || '');
          setProfilePic(data.photoURL || '/images/No_image.jpg');
          setInfo(data.info || '');
          setLocation(data.location || '');
          setEmail(data.email || '');
          setPhone(data.phone || '');
        }
      }
    };

    fetchProfileData();
  }, [user]);

  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && user) {
      const file = e.target.files[0];
      const storageRef = ref(storage, `images/${user.uid}/${file.name}`);
      setIsUploading(true);
      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setProfilePic(downloadURL);
        await firebaseUpdateProfile(user, { photoURL: downloadURL });
        setIsUploading(false);
      } catch (error) {
        console.error('Failed to upload Picture', error);
        setIsUploading(false);
      }
    }
  };

  const handleSave = async () => {
    if (user) {
      await firebaseUpdateProfile(user, { displayName: name, photoURL: profilePic });
      // Save other profile fields to Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        displayName: name,
        photoURL: profilePic,
        info,
        location,
        email,
        phone,
      }, { merge: true });
    }
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
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
            accept="images/*"
            className="hidden"
            onChange={handleProfilePicChange}
          />
        </div>
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
                className="p-2 rounded-md text-black w-full"
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
              <button onClick={handleSave} className="p-2 bg-blue-500 rounded-md">
                Save
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p>{name}</p>
              <p>{info}</p>
              <p>{location}</p>
              <p>{email}</p>
              <p>{phone}</p>
              <button onClick={handleEditToggle} className="p-2 bg-blue-500 rounded-md">
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;