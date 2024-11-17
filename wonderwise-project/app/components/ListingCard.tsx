import React from 'react';
import { useRouter } from 'next/navigation';

export interface ListingCardProps {
  id: string;
  name: string;
  city: string;
  description: string;
  price: number;
  guests: number;
  rooms: number;
  images: string[];
  category?: string; // Add category field
  showEditButton?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({ id, name, city, description, price, guests, rooms, images, category, showEditButton = false }) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/admin/edit/${id}`);
  };

  const handleDetail = () => {
    router.push(`/detailpage/${id}`);
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg cursor-pointer" onClick={handleDetail}>
      {images.length > 0 && (
        <img src={images[0]} alt={name} className="w-full h-80 object-cover" />
      )}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2">
          {images.slice(1, 4).map((image, index) => (
            <img key={index} src={image} alt={`Additional image ${index + 1}`} className="w-1/2 h-40 object-cover rounded" />
          ))}
        </div>
      )}
      <div className="p-4">
        <h2 className="font-bold text-2xl font-livvic">{name}</h2>
        <p className="text-gray-600 text-xl font-livvic">{city}</p>
        <p className="text-gray-800 text-xl  mt-2 font-livvic">{description}</p>
        <p className="text-gray-800 text-xl  mt-2 font-livvic">Guests: {guests}</p>
        <p className="text-gray-800 text-xl  mt-2 font-livvic">Rooms: {rooms}</p>
        <p className="text-gray-800 text-xl  mt-2 font-livvic">Price: ${price}</p>
        {category && <p className="text-gray-800 text-xl  mt-2 font-livvic">Category: {category}</p>}
        {showEditButton && (
          <button onClick={handleEdit} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded font-livvic">
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default ListingCard;