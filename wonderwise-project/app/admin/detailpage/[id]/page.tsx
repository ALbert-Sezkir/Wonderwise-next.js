'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';

interface Listing {
  name: string;
  price: number;
  images: string[];
  description: string;
  cancellationPolicy: string;
  userId: string;
  category?: string; // Add category field
}

const AdminDetailPage = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

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

  useEffect(() => {
    if (listing && listing.images.length > 0) {
      const img = new Image();
      img.src = listing.images[0];
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
    }
  }, [listing]);

  const handleSave = async () => {
    if (listing && id) {
      const docRef = doc(db, 'accommodations', id);
      await updateDoc(docRef, listing);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (id) {
      const docRef = doc(db, 'accommodations', id);
      await deleteDoc(docRef);
      router.push('/admin');
    }
  };

  if (!listing) {
    return <p>Loading...</p>;
  }

  const isOwner = user?.uid === listing.userId;

  return (
    <div className="p-4 flex justify-center">
      <div className="w-1/2 p-4">
        {isEditing ? (
          <input
            type="text"
            value={listing.name}
            onChange={(e) => setListing({ ...listing, name: e.target.value })}
            className="text-2xl font-bold mb-4 w-full"
          />
        ) : (
          <h1 className="text-2xl font-bold mb-4">{listing.name}</h1>
        )}
        {listing.images.length > 0 && imageDimensions && (
          <Image
            src={listing.images[0]}
            alt={listing.name}
            width={imageDimensions.width}
            height={imageDimensions.height}
            className="w-full h-96 object-cover mb-4"
          />
        )}
        {listing.images.length > 1 && (
          <div className="flex gap-2 mb-4">
            {listing.images.slice(1, 3).map((image, index) => (
              <Image key={index} src={image} alt={`Additional image ${index + 1}`} width={150} height={150} className="w-1/2 h-56 object-cover rounded" />
            ))}
          </div>
        )}
        {isEditing ? (
          <input
            type="text"
            value={listing.price}
            onChange={(e) => setListing({ ...listing, price: parseFloat(e.target.value) })}
            className="text-xl font-bold mb-4 w-full"
          />
        ) : (
          <p className="text-xl font-bold mb-4">Price: ${listing.price}</p>
        )}
        {listing.category && <p className="text-xl font-bold mb-4">Category: {listing.category}</p>}
        {isEditing ? (
          <textarea
            value={listing.description}
            onChange={(e) => setListing({ ...listing, description: e.target.value })}
            className="text-xl mb-4 w-full"
          />
        ) : (
          <p className="text-xl">{listing.description}</p>
        )}
        {isEditing ? (
          <textarea
            value={listing.cancellationPolicy}
            onChange={(e) => setListing({ ...listing, cancellationPolicy: e.target.value })}
            className="text-xl mb-4 w-full"
          />
        ) : (
          <p className="text-xl">{listing.cancellationPolicy}</p>
        )}
        {isOwner && (
          <>
            <button onClick={() => setIsEditing(!isEditing)} className="mt-4 p-2 bg-blue-500 text-white rounded">
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            {isEditing && (
              <button onClick={handleSave} className="mt-4 p-2 bg-green-500 text-white rounded">
                Save
              </button>
            )}
            <button onClick={handleDelete} className="mt-4 p-2 bg-red-500 text-white rounded">
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDetailPage;