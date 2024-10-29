'use client'

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md z-50 relative">
      <div className="w-full h-24 mx-auto px-28 py-2 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/images/Logo.png"
            alt="Logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </Link>
        <Link href="/">
          <Image
            src="/images/Font_Logo.png"
            alt="Font Logo"
            width={200}
            height={70}
            className="object-contain"
          />
        </Link>
        <div className="relative">
          <button onClick={toggleMenu} className="focus:outline-none">
            <Image
              src="/images/placeholder.jpg"
              alt="Profile"
              width={40}
              height={40}
              className="object-cover rounded-full"
            />
          </button>
          {isOpen && (
            <div className="absolute right-1/2 transform translate-x-1/2 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
              <Link href="/login">
                <div className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Log in</div>
              </Link>
              <Link href="/register">
                <div className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Register</div>
              </Link>
              <Link href="/profile">
                <div className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Profile</div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;