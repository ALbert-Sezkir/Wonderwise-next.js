import React from 'react';

import Image from 'next/image';
import LoginForm from '../components/loginForm';

function Page() {
  return (
    <div className="relative h-screen">
      <Image
        src="/images/Login_Font.jpg"
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="z-0"
      />
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <LoginForm />
      </div>
    </div>
  );
}

export default Page;