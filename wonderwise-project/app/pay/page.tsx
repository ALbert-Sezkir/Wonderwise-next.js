'use client'

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import Image from 'next/image';
import { differenceInDays, format, parseISO } from 'date-fns';
import { MdOutlineWifiOff, MdKeyboardArrowDown, MdAdd } from 'react-icons/md';
import { FaTree, FaCcMastercard, FaCcVisa, FaCcAmex } from 'react-icons/fa';
import { TbAirConditioning } from 'react-icons/tb';
import { LuBedSingle, LuBedDouble } from 'react-icons/lu';

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

const PaymentPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const startDateParam = searchParams.get('startDate');
  const endDateParam = searchParams.get('endDate');
  const guestCountParam = searchParams.get('guestCount');
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [guestCount] = useState(guestCountParam ? parseInt(guestCountParam) : 1);
  const [startDate] = useState<Date | null>(startDateParam ? parseISO(startDateParam) : null);
  const [endDate] = useState<Date | null>(endDateParam ? parseISO(endDateParam) : null);
  const [showDebitCard, setShowDebitCard] = useState(false);
  const [selectedCard, setSelectedCard] = useState('mastercard');

  useEffect(() => {
    const fetchListing = async () => {
      if (id) {
        const docRef = doc(db, 'accommodations', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Listing;
          setListing(data);
        }
      }
    };

    fetchListing();
  }, [id]);

  const calculateTotalPrice = () => {
    if (startDate && endDate) {
      const days = differenceInDays(endDate, startDate) + 1;
      const listingPrice = listing ? parseFloat(listing.price.toString()) : 0;
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
    return <p className="font-livvic">Loading...</p>;
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 pb-20">
      <div className="w-full md:w-2/3 flex flex-col items-center">
        <div className="flex flex-col md:flex-row w-full">
          <div className="w-full md:w-1/2">
            <h1 className="text-2xl font-bold mb-4 font-livvic">{listing.name}</h1>
            {listing.images.length > 0 && (
              <Image src={listing.images[0]} alt={listing.name} width={800} height={600} className="w-full h-96 object-cover mb-4 rounded-lg" />
            )}
          </div>
          <div className="w-full md:w-1/2 flex items-center justify-center text-xl p-4">
            <p className="font-livvic ml-6 sm:ml-2 ">{listing.description}</p>
          </div>
        </div>
        <hr className="w-4/5 mt-4" />
        <div className="w-full flex flex-col mt-4">
  <div className="w-full md:w-1/3 text-center md:text-right pr-2">
    <h2 className="text-2xl font-bold mb-4 font-livvic">Price information</h2>
  </div>
          <div className="flex justify-between w-full mb-2">
            <div className="w-full md:w-1/3 text-right pr-2">
              <p className="text-xl font-livvic">${listing.price} x {days} nights x {guestCount} guests</p>
            </div>
            <div className="w-full md:w-1/3 text-center">
              <p className="text-xl font-livvic">${totalPrice}</p>
            </div>
          </div>
          <div className="flex justify-between w-full mb-2">
            <div className="w-full md:w-1/3 text-right pr-2">
              <p className="text-xl font-livvic">Cleaning fee:</p>
            </div>
            <div className="w-full md:w-1/3 text-center">
              <p className="text-xl font-livvic">$20</p>
            </div>
          </div>
          <div className="flex justify-between w-full mb-2">
            <div className="w-full md:w-1/3 text-right pr-2">
              <p className="text-xl font-livvic">Wanderwise fee:</p>
            </div>
            <div className="w-full md:w-1/3 text-center">
              <p className="text-xl font-livvic">$10</p>
            </div>
          </div>
          <hr className="w-4/5 mt-4 ml-32" />
          <div className="flex justify-between w-full mb-2">
            <div className="w-full md:w-1/3 text-right pr-2">
              <p className="text-xl font-bold font-livvic">Total price:</p>
            </div>
            <div className="w-full md:w-1/3 text-center">
              <p className="text-xl font-bold font-livvic">${finalPrice}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/3 border-2 rounded-lg border-[#0E4411] p-4 mt-8">
        <h1 className="text-xl font-bold font-livvic">Your Journey</h1>
        {startDate && endDate && (
          <div className="flex flex-col">
            <div className="flex items-center">
              <p className="text-sm font-livvic">{format(startDate, 'dd MMM')} - {format(endDate, 'dd MMM')},</p>
              <p className="text-sm font-livvic ml-3">{guestCount} guests -</p>
              <p className="text-sm font-livvic ml-1">{listing.rooms} rooms</p>
            </div>
            <div className="flex flex-col mt-8 gap-4 ml-4">
  <div className="flex items-center">
    <MdOutlineWifiOff className="text-3xl mr-7" style={{ color: '#344E41' }} />
    <span className="text-sm font-livvic">No WiFi</span>
  </div>
  <div className="flex items-center">
    <FaTree className="text-4xl mr-7" style={{ color: '#344E41' }} />
    <span className="text-sm font-livvic">Nature</span>
  </div>
  <div className="flex items-center">
    <TbAirConditioning className="text-4xl mr-7" style={{ color: '#344E41' }} />
    <span className="text-sm font-livvic">AC</span>
  </div>
  <div className="flex items-center">
    <LuBedSingle className="text-4xl mr-7" style={{ color: '#344E41' }} />
    <span className="text-sm font-livvic">Single Bed</span>
  </div>
  <div className="flex items-center">
    <LuBedDouble className="text-4xl mr-7" style={{ color: '#344E41' }} />
    <span className="text-sm font-livvic">Double Bed</span>
  </div>
</div>
          </div>
        )}
      </div>
      <p className="text-xl font-livvic mt-2">Credit Card Details</p>
      <div className="w-full md:w-1/3 border-2 rounded-lg border-[#0E4411] mt-4 p-4 flex justify-between items-center">
        <div className="text-xl font-livvic">
          <p>Payment</p>
          <p>Method</p>
        </div>
        <div className="flex space-x-4">
          <FaCcMastercard className="text-5xl" style={{ color: '#EB001B' }} />
          <FaCcVisa className="text-5xl" style={{ color: '#1A1F71' }} />
          <FaCcAmex className="text-5xl" style={{ color: '#0077A6' }} />
        </div>
      </div>
      <div className="w-full md:w-1/3 border-2 rounded-lg border-[#0E4411] mt-4 p-4 flex justify-between items-center cursor-pointer" onClick={() => setShowDebitCard(!showDebitCard)}>
        <div className="text-xl font-livvic">Debit Card</div>
        <MdKeyboardArrowDown className="text-3xl" style={{ color: '#0E4411' }} />
      </div>
      {showDebitCard && (
        <div className="w-full md:w-1/3 border-2 rounded-lg border-[#0E4411] mt-4 p-4">
          <div className="text-xl font-livvic ">Debit Card Details
          <div className="w-full border-2 rounded-lg border-[#0E4411] p-4 flex justify-between items-center mt-4">
            <div className="flex items-center">
              <div className="relative w-6 h-6">
                <div className="absolute w-6 h-6 bg-red-600 rounded-full"></div>
                <div className="absolute w-6 h-6 bg-yellow-400 rounded-full left-3"></div>
              </div>
              <p className="text-xl font-livvic ml-4">MasterCard Bank &nbsp;&nbsp; **** **** **** 4565</p>
            </div>
            <div className="w-4 h-4 border-2 border-[#0E4411] rounded-full flex items-center justify-center cursor-pointer" onClick={() => setSelectedCard('mastercard')}>
              {selectedCard === 'mastercard' && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
            </div>
          </div>
          <div className="w-full h-14 border-2 rounded-lg border-[#0E4411] p-4 flex justify-between items-center mt-4">
            <div className="flex items-center">
              <FaCcVisa className="text-4xl mr-2" style={{ color: '#1A1F71' }} />
              <p className="text-xl font-livvic ml-4">VISA Bank &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **** **** **** 5714</p>
            </div>
            <div className="w-4 h-4 border-2 border-[#0E4411] rounded-full flex items-center justify-center cursor-pointer" onClick={() => setSelectedCard('visa')}>
              {selectedCard === 'visa' && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
            </div>
          </div>
          <div className="flex items-center mt-6">
            <MdAdd className="text-2xl mr-2" />
            <p className="text-xl font-livvic">Add New Cards</p>
          </div>
        </div>
        </div>
      )}
      <div className="w-full md:w-1/3 border-2 rounded-lg border-[#0E4411] mt-4 p-4">
        <h1 className="text-xl font-livvic">Payment Details</h1>
        <hr className="w-full mt-2" style={{ borderColor: '#588157' }} />
        <div className="flex justify-between mt-2">
          <p className="font-livvic">Order</p>
          <p className="font-livvic">${totalPrice}</p>
        </div>
        <div className="flex justify-between mt-2">
          <p className="font-livvic">Service</p>
          <p className="font-livvic">${20 + 10}</p>
        </div>
        <hr className="w-full mt-2" style={{ borderColor: '#588157' }} />
        <div className="flex justify-between mt-2">
          <p className="font-livvic font-semibold">Total</p>
          <p className="font-livvic font-semibold">${finalPrice}</p>
        </div>
        <hr className="w-full mt-2" style={{ borderColor: '#588157' }} />
      </div>
        <button
          className="w-full md:w-1/3 h-12 mt-4 py-2 bg-[#344E41] text-white text-xl font-livvic rounded"
          onClick={() => window.location.href = '/confirmpay'}
        >
          Pay now
        </button>
    </div>
  );
};

export default PaymentPage;