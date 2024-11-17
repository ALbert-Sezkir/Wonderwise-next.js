'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from '../../firebaseConfig';
import { doc, setDoc } from "firebase/firestore";
import { FcGoogle } from 'react-icons/fc';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User registered:", user);

      // Add user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        uid: user.uid,
        createdAt: new Date()
      });

      router.push('/'); // Redirect to the landing page
    } catch (error) {
      console.error("Error registering with email:", error);
      
      
    }
  };

  const handleGoogleRegister = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User registered with Google:", user);

      // Add user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        uid: user.uid,
        createdAt: new Date()
      });

      router.push('/'); // Redirect to the landing page
    } catch (error) {
      console.error("Error registering with Google:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <h2 className="text-2xl font-bold text-center text-white">Create an account!</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-white">Email</label>
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
          <label htmlFor="password" className="text-white">Password</label>
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
        <div className="flex flex-col gap-2">
          <label htmlFor="confirmPassword" className="text-white">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A3B18A]"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-[#A3B18A] rounded-md hover:bg-[#8F9B6E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A3B18A]"
        >
          Register with Email
        </button>
      </form>
      <button
        onClick={handleGoogleRegister}
        className="w-full px-4 py-2 text-white bg-[#A3B18A] rounded-md hover:bg-[#8F9B6E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A3B18A] flex items-center justify-center gap-2"
      >
        <FcGoogle className="text-xl" />
        Register with Google
      </button>
    </div>
  );
};

export default RegisterForm;