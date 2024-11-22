'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { FaBars } from 'react-icons/fa';

const HamburgerMenu = () => {
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
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="relative sm:hidden">
      <button onClick={toggleMenu} className="focus:outline-none">
        <FaBars size={24} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
          {user ? (
            <>
              <Link href="/profile">
                <div className="block px-4 py-2 text-gray-800 font-livvic hover:bg-gray-200">Profile</div>
              </Link>

              <Link href="/my-reservations">
                <div className="block px-4 py-2 text-gray-800 font-livvic hover:bg-gray-200">My Reservations</div>
              </Link>

              <Link href="/admin">
                <div className="block px-4 py-2 text-gray-800 font-livvic hover:bg-gray-200">My WonderWise</div>
              </Link>
              <div
                onClick={handleLogout}
                className="block px-4 py-2 text-gray-800 font-livvic hover:bg-gray-200 cursor-pointer"
              >
                Logout
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <div className="block px-4 py-2 text-gray-800 font-livvic hover:bg-gray-200">Log in</div>
              </Link>
              <Link href="/register">
                <div className="block px-4 py-2 text-gray-800 font-livvic hover:bg-gray-200">Register</div>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;