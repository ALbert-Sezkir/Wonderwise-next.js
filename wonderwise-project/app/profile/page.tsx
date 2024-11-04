// file: app/profile/page.tsx
'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    displayName: '',
    photoURL: '',
    info: '',
    location: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setProfileData(userDoc.data());
        }
      }
    };

    fetchProfileData();
  }, [user]);

  return (
    <div className="flex justify-center items-center h-screen p-4">
      <div className="flex flex-col items-center w-full max-w-2xl">
        <div className="relative mb-8">
          <Image
            width={200}
            height={200}
            src={profileData.photoURL || '/default-profile.png'}
            alt="Profile"
            className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-[#344E41]"
          />
        </div>
        <div className="w-full bg-[#344E41] p-8 rounded-md text-white">
          <div className="flex flex-col gap-4">
            <p>{profileData.displayName}</p>
            <p>{profileData.info}</p>
            <p>{profileData.location}</p>
            <p>{profileData.email}</p>
            <p>{profileData.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;