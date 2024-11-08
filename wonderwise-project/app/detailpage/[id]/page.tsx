'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { MdOutlineWifiOff } from 'react-icons/md';
import { FaTree } from 'react-icons/fa';
import { TbAirConditioning } from 'react-icons/tb';
import { LuBedSingle, LuBedDouble } from 'react-icons/lu';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { differenceInDays } from 'date-fns';

interface Listing {
  name: string;
  price: number;
  images: string[];
  city: string;
  description: string;
  guests: number;
  rooms: number;
}

interface Profile {
  name: string;
  email: string;
  phone: string;
  photoURL: string;
}

const DetailPage = () => {
  const { id } = useParams() as { id: string };
  const { user } = useAuth();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [guests, setGuests] = useState('');
  const [rooms, setRooms] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [guestCount, setGuestCount] = useState(1); // Add state for guest count
  const [startDate, setStartDate] = useState<Date | null>(null); // Add state for start date
  const [endDate, setEndDate] = useState<Date | null>(null); // Add state for end date

  useEffect(() => {
    const fetchListing = async () => {
      if (id) {
        const docRef = doc(db, 'accommodations', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Listing;
          setListing(data);
          setName(data.name);
          setCity(data.city);
          setDescription(data.description);
          setPrice(data.price.toString());
          setGuests(data.guests.toString());
          setRooms(data.rooms.toString());
          setImages(data.images);
        }
      }
    };

    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);  // Fetches the logged-in user's profile
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data() as Profile);
        }
      }
    };

    fetchListing();
    fetchProfile();
  }, [id, user]);

  const handleDelete = async () => {
    if (id) {
      try {
        await deleteDoc(doc(db, 'accommodations', id));
        router.push('/');
      } catch (error) {
        console.error('Error deleting listing: ', error);
      }
    }
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

  const calculateTotalPrice = () => {
    if (startDate && endDate) {
      const days = differenceInDays(endDate, startDate) + 1;
      const listingPrice = parseFloat(price);
      const totalPrice = days * listingPrice * guestCount;
      const cleaningFee = 20;
      const wanderwiseFee = 10;
      const finalPrice = totalPrice + cleaningFee + wanderwiseFee;
      return { days, totalPrice, finalPrice };
    }
    return { days: 0, totalPrice: 0, finalPrice: 0 };
  };

  const { days, totalPrice, finalPrice } = calculateTotalPrice();

  if (!listing) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4 flex flex-col w-full"> {/* Ensure full width for the parent container */}
      <div className="flex justify-between w-full"> {/* Full width for the inner flex container */}
        {/* Left Section: Listing Details */}
        <div className="w-1/2 h-full p-4"> {/* Left section takes half the width */}
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-2xl font-bold mb-4 w-full"
            />
          ) : (
            <h1 className="text-2xl font-bold mb-4">{listing.name}</h1>
          )}
          {listing.images.length > 0 && (
            <img src={listing.images[0]} alt={listing.name} className="w-full h-96 object-cover mb-4" />
          )}
          {listing.images.length > 1 && (
            <div className="flex gap-2 mb-4">
              {listing.images.slice(1, 3).map((image, index) => (
                <img key={index} src={image} alt={`Additional image ${index + 1}`} className="w-1/2 h-56 object-cover rounded" />
              ))}
            </div>
          )}
          {isEditing ? (
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="text-xl font-bold mb-4 w-full"
            />
          ) : (
            <p className="text-xl font-bold mb-4">Price: ${listing.price}</p>
          )}
          <Image src="/images/Arizona.png" alt="Arizona" width={960} height={200} className="w-full h-96 object-cover mb-4" />
        </div>

        {/* Right Section: Profile and Amenities */}
        <div className="w-1/2 p-8 flex flex-col items-center"> {/* Right section also takes half the width */}
          <div className="text-center max-w-2xl mt-8">
            {isEditing ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xl mb-4 w-full"
              />
            ) : (
              <p className="text-xl">{listing.description}</p>
            )}
            <div className="flex justify-center mt-8 gap-12">
              <div className="flex flex-col mb-8 items-center">
                <MdOutlineWifiOff className="text-black text-4xl mb-2" />
                <span className="text-sm">No WiFi</span>
              </div>
              <div className="flex flex-col items-center">
                <FaTree className="text-black text-4xl mb-2" />
                <span className="text-sm">Nature</span>
              </div>
              <div className="flex flex-col items-center">
                <TbAirConditioning className="text-black text-4xl mb-2" />
                <span className="text-sm">AC</span>
              </div>
              <div className="flex flex-col items-center">
                <LuBedSingle className="text-black text-4xl mb-2" />
                <span className="text-sm">Single Bed</span>
              </div>
              <div className="flex flex-col items-center">
                <LuBedDouble className="text-black text-4xl mb-2" />
                <span className="text-sm">Double Bed</span>
              </div>
            </div>
            <div className="border border-[#0E4411] rounded-lg p-4 mt-10 max-w-lg mx-auto">
              <p className="text-xl">Cancel up to 24 hours before your stay for a full refund. Cancellations made less than 24 hours before the stay will incur a 50% charge.</p>
            </div>
            <div className="border border-[#0E4411] rounded-lg p-4 mt-28 h-[24rem] max-w-lg mx-auto">
              <div className="flex justify-center items-center p-2">
                <div className="flex flex-col items-center w-full max-w-2xl">
                  <div className="relative mb-8">
                    <Image
                      width={200}
                      height={200}
                      src={profileData?.photoURL || '/images/No_image.jpg'}
                      alt="Profile"
                      className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-[#344E41]"
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <p className="text-2xl font-bold">{profileData?.name}</p>
                    <p>Email: {profileData?.email}</p>
                    <p>Phone: {profileData?.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width horizontal line */}
      <hr className="my-4 w-full" />

      {/* Centered border covering half the page */}
      <div className="border border-[#0E4411] rounded-lg p-4 w-1/2 mt-8 h-[24-rem] mx-auto">
        <div className="flex justify-center">
          <p className="text-xl">Price per night</p>
          <p className="text-xl">${listing.price}</p>
        </div>
        <div className="flex justify-center mt-4">
          <div className="border border-[#0E4411] rounded-lg p-2 w-2/4 flex items-center justify-center">
            <p className="text-xl">Guests</p>
            <div className="flex items-center ml-4">
              <button onClick={() => setGuestCount(guestCount > 1 ? guestCount - 1 : 1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
              <p className="text-xl mx-4">{guestCount}</p>
              <button onClick={() => setGuestCount(guestCount + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
            </div>      
          </div>
        </div>
        <div className="flex justify-center mt-4  ">
        
          <div className="border border-[#0E4411] rounded-lg p-2 w-1/4 cursor-pointer flex flex-col items-center" onClick={() => document.querySelector('.react-datepicker-wrapper input')?.focus()}>
            <p className="text-xl text-center">Check in Date</p>
            <p className="text-xl text-center">{startDate ? startDate.toLocaleDateString() : 'Select Date'}</p>
          </div>
          <div className="border border-[#0E4411] rounded-lg p-2 w-1/4 ml-4 cursor-pointer flex flex-col items-center" onClick={() => document.querySelector('.react-datepicker-wrapper input')?.focus()}>
            <p className="text-xl text-center">Check out Date</p>
            <p className="text-xl text-center">{endDate ? endDate.toLocaleDateString() : 'Select Date'}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
        <DatePicker
            selected={startDate}
            onChange={(dates: [Date | null, Date | null]) => {
              const [start, end] = dates;
              setStartDate(start);
              setEndDate(end);
            }}
            startDate={startDate || undefined}
            endDate={endDate || undefined}
            selectsRange
            inline
            className="w-9/10"
          />
        </div>
        <hr className="my-4 w-full" />
        
        {startDate && endDate && (
          <div className="flex flex-col items-center">
            <p className="text-xl">${listing.price} x {days} nights x {guestCount} guests = ${totalPrice}</p>
            <p className="text-xl">Cleaning fee: $20</p>
            <p className="text-xl">Wanderwise fee: $10</p>
            <hr className="my-4 w-full" />
            <p className="text-xl font-bold">Total price: ${finalPrice}</p>
          </div>
        )}
      </div>

      {/* Centered buttons */}
      <div className="flex justify-center mt-4">
        <button className="bg-[#588157] text-white text-xl mt-4 p-4 w-1/2 rounded">BOOK HERE</button>
      </div>
      {user && (
        <>
          <div className="flex justify-center mt-4">
            <button
              className="bg-[#344E41] text-white text-xl mt-4 p-4 w-1/2 rounded"
              onClick={() => router.push(`/admin/edit/${id}`)}
            >
              Edit Listing
            </button>
          </div>
          {isEditing && (
            <div className="flex justify-center mt-4">
              <input type="file" multiple onChange={handleFileChange} className="mt-2" />
              <div className="flex flex-wrap gap-2 mt-2">
                {previewImages.map((src, index) => (
                  <Image key={index} src={src} alt={`Preview ${index + 1}`} width={96} height={96} className="w-24 h-24 object-cover rounded" />
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-center mt-4">
            <button
              className="bg-red-500 text-white text-xl mt-4 p-4 w-1/2 rounded"
              onClick={handleDelete}
            >
              Delete Listing
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DetailPage;