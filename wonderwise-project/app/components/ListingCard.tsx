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
  showEditButton?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({ id, name, city, description, price, guests, rooms, images, showEditButton = false }) => {
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
        <div className="flex flex-wrap gap-2 mt-2 px-4">
          {images.slice(1).map((image, index) => (
            <img key={index} src={image} alt={`Additional image ${index + 1}`} className="w-24 h-24 object-cover rounded" />
          ))}
        </div>
      )}
      <div className="p-4">
        <h2 className="text-xl font-bold">{name}</h2>
        <p className="text-gray-600">{city}</p>
        <p className="text-gray-800 mt-2">{description}</p>
        <p className="text-gray-800 mt-2">Guests: {guests}</p>
        <p className="text-gray-800 mt-2">Rooms: {rooms}</p>
        <p className="text-gray-800 mt-2">Price: ${price}</p>
        {showEditButton && (
          <button onClick={handleEdit} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default ListingCard;