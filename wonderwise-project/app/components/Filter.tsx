import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { BiSearch } from 'react-icons/bi';
import Counter from './Counter';

interface FilterProps {
  onClose: () => void;
  onApply: (guests: number, rooms: number, price: number) => void;
}

const Filter: React.FC<FilterProps> = ({ onClose, onApply }) => {
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [price, setPrice] = useState(0);

  const handleApply = () => {
    onApply(guests, rooms, price);
    onClose();
  };

  return (
    <div className="absolute top-full mt-2 w-2/3 h-auto bg-white border border-black rounded-md shadow-lg z-10">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-2xl font-bold">Where are we headed?</h2>
        <button onClick={onClose} className="text-black">
          <FaTimes className="text-2xl font-bold" />
        </button>
      </div>
      <div className="p-4 space-y-6">
        <div>
          <h3 className="text-gray-700 text-xl font-bold">More information</h3>
          <p className="text-lg text-gray-500">Find your perfect stay!</p>
        </div>
        <div className="flex justify-between items-center mx-4">
          <Counter 
            title="Guests"
            subtitle="How many guests are coming?"
            value={guests}
            onChange={setGuests}
          />
        </div>
        <div className="flex justify-between items-center mx-4">
          <Counter 
            title="Rooms"
            subtitle="How many rooms do you need?"
            value={rooms}
            onChange={setRooms}
          />
        </div>
        <div className="flex justify-between items-center mx-4">
          <Counter 
            title="Price"
            subtitle="Sort price here."
            value={price}
            onChange={setPrice}
          />
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={handleApply}
            className="px-10 py-4 bg-red-500 text-white text-xl font-semibold rounded-md flex items-center space-x-1"
          >
            <div className="p-2 bg-rose-500 rounded-full text-white">
              <BiSearch size={18} />
            </div>
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filter;