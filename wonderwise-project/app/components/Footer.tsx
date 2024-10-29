import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#3F3F3F] py-4 text-white">
      <div className=" w-full mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-4xl font-bold mr-6">WonderWise</div>
          <div className="text-sm font-livic ">Find Your Way Home Away From Home</div>
        </div>
        <div className="text-sm">© 2024 WanderWise. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;