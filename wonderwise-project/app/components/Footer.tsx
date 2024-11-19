'use client'

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();
  const [isRegisterPage, setIsRegisterPage] = useState(false);

  useEffect(() => {
    setIsRegisterPage(pathname === '/register');
  }, [pathname]);

  return (
    <footer className={`bg-[#3F3F3F] py-4 text-white ${isRegisterPage ? 'hidden md:block' : ''}`}>
      <div className="w-full mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col md:flex-row items-center">
          <div className="text-4xl font-bold mr-6">WonderWise</div>
          <div className="text-sm font-livic">Find Your Way Home Away From Home</div>
        </div>
        <div className="text-sm mt-4 md:mt-0">© 2024 WanderWise. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;