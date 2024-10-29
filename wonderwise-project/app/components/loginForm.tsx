'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../../firebaseConfig';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in:", userCredential.user);
      router.push('/'); // Redirect to the landing page
    } catch (error) {
      console.error("Error signing in with email:", error);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User signed in with Google:", result.user);
      router.push('/'); // Redirect to the landing page
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm bg-[#344E41] bg-opacity-50 p-8 rounded-md">
      <h2 className="text-2xl font-bold text-center text-white">Sign in</h2>
      <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-white">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A3B18A]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-white">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A3B18A]"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-[#A3B18A] rounded-md hover:bg-[#8F9B6E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A3B18A]"
        >
          Continue with Email
        </button>
      </form>
      <button
        onClick={handleGoogleLogin}
        className="w-full px-4 py-2 text-white bg-[#A3B18A] rounded-md hover:bg-[#8F9B6E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A3B18A] flex items-center justify-center gap-2"
      >
        <FcGoogle className="text-xl" />
        Continue with Google
      </button>
      <div className="text-neutral-400 text-center mt-4 font-light">
        <div className="justify-center flex flex-row items-center gap-2">
          <div>Not a member? Create an account </div>
          <Link href="/register">
            <div className="text-neutral-50 cursor-pointer hover:underline">
              here
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;