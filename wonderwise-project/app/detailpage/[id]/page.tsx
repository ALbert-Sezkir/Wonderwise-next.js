'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, deleteDoc, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { MdOutlineWifiOff } from 'react-icons/md';
import { FaTree } from 'react-icons/fa';
import { TbAirConditioning } from 'react-icons/tb';
import { LuBedSingle, LuBedDouble } from 'react-icons/lu';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { differenceInDays, eachDayOfInterval, parseISO } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';

// Interface for Listing data
interface Listing {
  name: string;
  price: number;
  images: string[];
  city: string;
  description: string;
  guests: number;
  rooms: number;
  userId: string;
}

// Interface for Profile data
interface Profile {
  name: string;
  email: string;
  phone: string;
  photoURL: string;
}

const DetailPage = () => {
  const { id } = useParams() as { id: string }; // Get the ID from the URL
  const { user } = useAuth(); // Get the current user from the Auth context
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null); // State for the listing data
  const [profileData, setProfileData] = useState<Profile | null>(null); // State for the profile data
  const [isEditing] = useState(false); // State for editing mode
  const [name, setName] = useState(''); // State for the listing name
  // const [city, setCity] = useState(''); // State for the listing city
  const [description, setDescription] = useState(''); // State for the listing description
  const [price, setPrice] = useState(''); // State for the listing price
  // const [guests, setGuests] = useState(''); // State for the number of guests
  // const [rooms, setRooms] = useState(''); // State for the number of rooms
  // const [images, setImages] = useState<string[]>([]); // State for the listing images
  const [newImages, setNewImages] = useState<File[]>([]); // State for new images to be uploaded
  const [previewImages, setPreviewImages] = useState<string[]>([]); // State for preview images
  const [guestCount, setGuestCount] = useState(1); // State for the guest count
  const [startDate, setStartDate] = useState<Date | null>(new Date()); // State for the start date
  const [endDate, setEndDate] = useState<Date | null>(new Date()); // State for the end date
 
  const [bookedDates, setBookedDates] = useState<Date[]>([]); // State for booked dates
  const [dateRange, setDateRange] = useState([{ startDate: new Date(), endDate: new Date(), key: 'selection' }]); // State for date range

  // Fetch listing data
  useEffect(() => {
    const fetchListing = async () => {
      if (id) {
        const docRef = doc(db, 'accommodations', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Listing;
          setListing(data);
          setName(data.name);
          // setCity(data.city);
          setDescription(data.description);
          setPrice(data.price.toString());
          // setGuests(data.guests.toString());
          // setRooms(data.rooms.toString());
          // setImages(data.images);
        }
      }
    };

    // Fetch profile data
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data() as Profile);
        }
      }
    };

    // Fetch bookings data
    const fetchBookings = async () => {
      if (id) {
        const q = query(collection(db, 'bookings'), where('accommodationId', '==', id));
        const querySnapshot = await getDocs(q);
        const dates: Date[] = [];
        querySnapshot.forEach((doc) => {
          const booking = doc.data();
          const start = parseISO(booking.startDate);
          const end = parseISO(booking.endDate);
          const interval = eachDayOfInterval({ start, end });
          dates.push(...interval);
        });
        setBookedDates(dates);
      }
    };

    fetchListing();
    fetchProfile();
    fetchBookings();
  }, [id, user]);

  // Handle delete listing
  const handleDelete = async () => {
    if (id) {
      try {
        await deleteDoc(doc(db, 'accommodations', id));
        router.push('/admin');
      } catch (error) {
        console.error('Error deleting listing: ', error);
      }
    }
  };

  // Handle file change for new images
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewImages([...newImages, ...filesArray]);
      const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...previewUrls]);
    }
  };

  // Upload image to Firebase Storage
  // const uploadImage = async (file: File) => {
  //   const storageRef = ref(storage, `images/${file.name}`);
  //   await uploadBytes(storageRef, file);
  //   return getDownloadURL(storageRef);
  // };

  // Calculate total price for the booking
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

  // Handle booking
  const handleBooking = async () => {
    if (user && startDate && endDate) {
      try {
        const newBooking = {
          userId: user.uid,
          accommodationId: id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          guestCount,
          totalPrice: finalPrice,
          createdAt: new Date().toISOString(),
          image: listing?.images[0] || '/images/default-image.jpg',
          name: listing?.name || '',
          city: listing?.city || '',
          status: 'active',
          rooms: listing?.rooms || 0,
        };
        await addDoc(collection(db, 'bookings'), newBooking);
        toast.success('Booking successful!');
        setTimeout(() => {
          router.push(`/pay?id=${id}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&guestCount=${guestCount}`);
        }, 2000); // Redirect after 2 seconds
      } catch (error) {
        console.error('Error booking accommodation: ', error);
        toast.error('Failed to book accommodation. Please try again.');
      }
    } else {
      toast.error('Please select valid dates and ensure you are logged in.');
    }
  };

  if (!listing) {
    return <p>Loading...</p>;
  }

  const isOwner = user?.uid === listing.userId;

  return (
  <div className="p-8 flex flex-col w-full pb-20"> {/* Main container */}
    <Toaster /> {/* Toaster for notifications */}
    

    <div className="flex flex-col md:flex-row justify-between w-full mb-8"> {/* Flex container for main content */}
      {/* Image and Price Section */}
      <div className="w-full md:w-1/2 p-4">
        {isEditing ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-2xl font-bold mb-4 w-full"
          />
        ) : (
          <h1 className="text-2xl font-livvic font-bold mb-4">{listing.name}</h1>
        )}
        {listing.images.length > 0 && (
          <Image width={800} height={600} src={listing.images[0]} alt={listing.name} className="w-full md:h-96 object-cover mb-4" />
        )}
        {listing.images.length > 1 && (
          <div className="flex gap-2 mb-4">
            {listing.images.slice(1, 3).map((image, index) => (
              <Image width={400} height={300} key={index} src={image} alt={`Additional image ${index + 1}`} className="w-1/2 md:h-56 object-cover rounded" />
            ))}
          </div>
        )}
        {isEditing ? (
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="text-xl font-bold font-livvic mb-4 w-full"
          />
        ) : (
          <p className="text-xl font-bold font-livvic mb-4">Price: ${listing.price}</p>
        )}
      </div>

      {/* Description and Icons Section */}
<div className="w-full md:w-1/2 p-6 flex flex-col items-center md:mt-32">
  {isEditing ? (
    <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      className="text-xl mb-4 w-full"
    />
  ) : (
    <p className="text-xl h-42 w-full text-center mb-14">{listing.description}</p>
  )}
  <div className="flex justify-center mb-8 gap-4">
    <div className="flex flex-col items-center">
      <MdOutlineWifiOff className="text-4xl mb-2" style={{ color: '#344E41' }} />
      <span className="text-lg font-livvic">No WiFi</span>
    </div>
    <div className="flex flex-col items-center">
      <FaTree className="text-4xl mb-2" style={{ color: '#344E41' }} />
      <span className="text-lg font-livvic">Nature</span>
    </div>
    <div className="flex flex-col items-center">
      <TbAirConditioning className="text-4xl mb-2" style={{ color: '#344E41' }} />
      <span className="text-lg font-livvic">AC</span>
    </div>
    <div className="flex flex-col items-center">
      <LuBedSingle className="text-4xl mb-2" style={{ color: '#344E41' }} />
      <span className="text-lg font-livvic">Single Bed</span>
    </div>
    <div className="flex flex-col items-center">
      <LuBedDouble className="text-4xl mb-2" style={{ color: '#344E41' }} />
      <span className="text-lg font-livvic">Double Bed</span>
    </div>
  </div>
  <div className="border border-[#0E4411] rounded-lg p-4 mt-4 max-w-lg mx-auto">
    <p className="text-xl font-livvic">Cancel up to 24 hours before your stay for a full refund. Cancellations made less than 24 hours before the stay will incur a 50% charge.</p>
  </div>
</div>
    </div>

    {/* Map and Profile Section */}
<div className="flex flex-col md:flex-row justify-between w-full mb-8">
  <div className="w-full md:w-1/2 p-4 mt-4">
    <Image src="/images/Arizona.png" alt="Arizona" width={960} height={200} className="w-full md:h-96 object-cover mb-4" />
  </div>
  <div className="w-full md:w-1/2 p-8 flex flex-col items-center justify-start">
    <div className="border border-[#0E4411] rounded-lg p-4 mb-4 mx-auto sm:h-[24rem] md:w-[34rem] ">
      <div className="flex justify-center items-center p-2">
        <div className="flex flex-col items-center w-full max-w-2xl">
          <div className="relative mb-6">
            <Image
              width={200}
              height={200}
              src={profileData?.photoURL || '/images/No_image.jpg'}
              alt="Profile"
              className="w-48 h-48 md:w-48 md:h-48 rounded-full object-cover border-4 border-[#344E41]"
            />
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-2xl font-livvic font-bold">{profileData?.name}</p>
            <p className='font-livvic text-xl'>Email: {profileData?.email}</p>
            <p className='font-livvic text-xl'>Phone: {profileData?.phone}</p>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <hr className="my-6 w-full" /> 

    {/* Booking details section */}
    <div className="mx-auto p-8 rounded-lg space-y-4 w-full md:w-2/3 lg:w-1/3 border-2 border-brunswickgreen shadow-md">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between p-2">
          <p className="text-xl font-livvic">Price per night</p>
          <p className="text-xl font-livvic">${listing.price}</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 border-2 border-brunswickgreen p-2">
          <label className="text-xl font-livvic">Guests:</label>
          <div className="flex items-center ml-0 md:ml-4">
            <button onClick={() => setGuestCount(guestCount > 1 ? guestCount - 1 : 1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
            <p className="text-xl mx-4">{guestCount}</p>
            <button onClick={() => setGuestCount(guestCount + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
          </div>
        </div>

        <div className="flex border-2 border-brunswickgreen p-2">
          <DateRange
            editableDateInputs={true}
            onChange={(item) => {
              const { startDate, endDate } = item.selection;
              setDateRange([{ startDate: startDate || new Date(), endDate: endDate || new Date(), key: 'selection' }]);
              setStartDate(startDate || new Date());
              setEndDate(endDate || new Date());
            }}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            minDate={new Date()}
            disabledDates={bookedDates}
            rangeColors={["#344e41"]}
          />
        </div>

        <div className="space-y-2 p-2">
          <div className="flex justify-between">
            <p className="text-sm font-livvic">
              ${listing.price} x {days} nights
            </p>
            <p className="text-sm font-livvic">${totalPrice}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-livvic">Cleaning Fee</p>
            <p className="text-sm font-livvic">$20</p>
          </div>
          <div className="flex justify-between border-b-2 border-brunswickgreen pb-4">
            <p className="text-sm font-livvic">Wanderwise Fee</p>
            <p className="text-sm font-livvic">$10</p>
          </div>

          <div className="flex justify-between font-bold text-xl font-livvic">
            <p>Total Price</p>
            <p>${finalPrice}</p>
          </div>
        </div>
      </div>
    </div>

    <div className="flex justify-center mt-4">
      <button className="bg-[#588157] text-white text-xl mt-4 p-4 md:w-1/3 rounded sm:w-1/2" onClick={handleBooking}>BOOK HERE</button>
    </div>
    {user && isOwner && (
      <>
        <div className="flex justify-center mt-4">
          <button
            className="bg-[#344E41] text-white text-xl mt-4 p-4 md:w-1/3 rounded sm:w-20"
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
            className="bg-red-500 text-white text-xl mt-4 p-4 md:w-1/3 rounded sm:w-1/2"
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