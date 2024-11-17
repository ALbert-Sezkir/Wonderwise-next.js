'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { Booking } from '@/types/package';
import ListingCard from '@/app/components/ListingCard';

const MyReservations = () => {
  const [reservations, setReservations] = useState<Booking[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user.uid);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchReservations = async () => {
      if (currentUser) {
        const querySnapshot = await getDocs(collection(db, 'bookings'));
        const userReservations: Booking[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.userId === currentUser && data.status !== 'canceled') {
            userReservations.push({
              id: doc.id,
              userId: data.userId,
              accommodationId: data.accommodationId,
              startDate: data.startDate,
              endDate: data.endDate,
              guestCount: data.guestCount,
              totalPrice: data.totalPrice,
              createdAt: data.createdAt,
              image: data.image || '/images/default-image.jpg',
              name: data.name,
              city: data.city,
              status: data.status,
              rooms: data.rooms || 0, // Inkludera rooms-fältet
            });
          }
        });

        setReservations(userReservations);
      }
    };

    fetchReservations();
  }, [currentUser]);

  const handleDeleteReservation = async (reservationId: string) => {
    try {
      const docRef = doc(db, 'bookings', reservationId);
      await updateDoc(docRef, { status: 'canceled' });
      toast.success('Reservation canceled.');

      setReservations((prev) => prev.filter((res) => res.id !== reservationId));
    } catch (error) {
      toast.error('Failed to cancel reservation. Please try again.');
      console.error('Cancel reservation error:', error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-4 font-livvic">My Reservations</h1>
      {reservations.length > 0 ? (
        reservations.map((reservation) => (
          <div key={reservation.id} className="border p-4 mb-4 rounded shadow">
            <ListingCard
              id={reservation.accommodationId}
              name={reservation.name}
              city={reservation.city}
              description={`Check-in: ${new Date(reservation.startDate).toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })} - Check-out: ${new Date(reservation.endDate).toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}`}
              price={reservation.totalPrice}
              guests={reservation.guestCount}
              rooms={reservation.rooms}
              images={[reservation.image]}
              category={undefined} // Assuming category is not relevant for reservations
              showEditButton={false}
            />
            <button
              onClick={() => handleDeleteReservation(reservation.id)}
              className="mt-2 bg-red-500 text-white p-2 rounded font-livvic hover:bg-red-600 "
            >
              Cancel Reservation
            </button>
          </div>
        ))
      ) : (
        <p className="font-livvic">You have no reservations.</p>
      )}
    </div>
  );
};

export default MyReservations;