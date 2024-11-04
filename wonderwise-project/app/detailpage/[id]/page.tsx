'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { MdOutlineWifiOff } from 'react-icons/md';
import { FaTree } from 'react-icons/fa';
import { TbAirConditioning } from 'react-icons/tb';
import { LuBedSingle, LuBedDouble } from 'react-icons/lu';

interface Listing {
  name: string;
  price: number;
  images: string[];
}

const DetailPage = () => {
  const { id } = useParams() as { id: string };
  const [listing, setListing] = useState<Listing | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      if (id) {
        const docRef = doc(db, 'accommodations', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setListing(docSnap.data() as Listing);
        }
      }
    };

    fetchListing();
  }, [id]);

  if (!listing) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4 flex justify-center">
      <div className="w-1/2 p-4">
        <h1 className="text-2xl font-bold mb-4">{listing.name}</h1>
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
        <p className="text-xl font-bold mb-4">Price: ${listing.price}</p>
      </div>
      <div className="w-1/2 p-4 flex flex-col items-center">
        <div className="text-center max-w-2xl mt-8">
          <p className="text-xl">Welcome to our Cozy Lakeside Cabin—the perfect mountain escape! Nestled between majestic peaks and the sparkling lake, this cabin offers serenity and stunning views from every angle. Inside, enjoy a warm, rustic interior with two bedrooms, a fully equipped kitchen, and a wood-burning fireplace to complete the cozy mountain experience. Step outside onto the spacious deck or relax at the private dock, ideal for morning coffee or sunset moments. Guests can kayak, fish, or explore nearby trails right from the property. Only 15 minutes from the nearest town, you’ll have both seclusion and convenience. With Wi-Fi, a fire pit, and breathtaking scenery, this retreat is an unforgettable getaway. Book now for a peaceful escape!</p>
          <hr className="my-4" />
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
        </div>
      </div>
    </div>
  );
};

export default DetailPage;