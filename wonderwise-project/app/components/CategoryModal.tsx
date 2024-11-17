'use client'

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

interface Category {
  label: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
}

interface CategoryModalProps {
  title?: string;
  categories: Category[];
  onSelectCategory: (category: Category) => void;
  onClose: () => void;
  buttonText?: string;
  gridColumns?: string;
  customStyles?: {
    overlay?: string;
    container?: string;
    button?: string;
  };
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  title = "Select Property Type",
  categories,
  onSelectCategory,
  onClose,
  buttonText = "Close",
  gridColumns = "grid-cols-3",
  customStyles = {},
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category.label);
    onSelectCategory(category);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${customStyles.overlay}`}
      onClick={onClose} // Close modal on click outside content
    >
      <div
        className={`bg-timberwolf rounded-lg shadow-lg p-6 w-full max-w-sm sm:max-w-md lg:max-w-lg ${customStyles.container}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing on click inside modal
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Categories */}
        <div className={`grid ${gridColumns} gap-4 mx-4`}>
          {categories.map((category) => (
            <button
              key={category.label}
              onClick={() => handleCategoryClick(category)}
              className={`flex flex-col items-center p-4 border rounded-lg 
                ${
                  selectedCategory === category.label
                    ? "bg-gray-300"
                    : "hover:bg-gray-100"
                }`}
            >
              <category.icon size={32} className="text-brunswickgreen mb-2" />
              <p className="text-sm font-medium text-gray-700">
                {category.label}
              </p>
            </button>
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className={`w-full mt-6 py-2 rounded-lg ${customStyles.button} bg-brunswickgreen text-timberwolf hover:bg-green-800`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default CategoryModal;