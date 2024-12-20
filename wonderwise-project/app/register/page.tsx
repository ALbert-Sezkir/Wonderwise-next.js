import React from 'react';
import RegisterForm from '../components/RegisterForm';
import Image from 'next/image';

const RegisterPage = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-2/3 relative h-1/2 md:h-full">
        <Image
          src="/images/Register_font.jpg"
          alt="Register"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="w-full md:w-1/3 flex flex-col items-center justify-center bg-[#344E41] p-8">
        <h1 className="text-4xl mb-4 text-white">Register</h1>
        <RegisterForm />
        <p className="mt-4 text-white">
          Already have an account?{' '}
          <a href="/login" className="text-[#A3B18A] underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;