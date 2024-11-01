'use client'

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig"; // Import your Firebase config

const Navbar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
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
              src={user?.photoURL || "/images/placeholder.jpg"}
              alt="Profile"
              width={40}
              height={40}
              className="object-cover rounded-full"
            />
          </button>
          {isOpen && (
            <div className="absolute right-1/2 transform translate-x-1/2 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
              {user ? (
                <>
                  <Link href="/profile">
                    <div className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Profile</div>
                  </Link>
                  <Link href="/reservations">
                    <div className="block px-4 py-2 text-gray-800 hover:bg-gray-200">My Reservations</div>
                  </Link>
                  <div
                    onClick={handleLogout}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
                  >
                    Logout
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <div className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Log in</div>
                  </Link>
                  <Link href="/register">
                    <div className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Register</div>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;