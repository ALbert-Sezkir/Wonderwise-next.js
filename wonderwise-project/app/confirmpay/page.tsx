import React from 'react';
import Image from 'next/image';
import { FaCheck } from 'react-icons/fa';

function ConfirmPage() {
  return (
    <div className="relative w-full h-screen">
      <Image
        src="/images/pay&confirm_bg_font.jpg"
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="z-0"
      />
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-50">
        <div className="absolute top-10 text-center">
          <h1 className="text-6xl mt-24 font-bold text-white">WonderWise</h1>
          <p className="text-2xl text-white">Find Your Home Away From Home</p>
          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center justify-center w-24 h-24 rounded-full border-4 border-white bg-[#588157]">
              <FaCheck className="text-white text-4xl" />
            </div>
          </div>
          <div className="bg-white bg-opacity-75 p-14 rounded-lg text-center mt-8">
            <h1 className="text-4xl font-bold text-black mb-4">Payment Successful!</h1>
            <hr className="border-black mb-4"/>
            <p className="text-black text-3xl ">
              Payment successful! Thank you for your booking.<br />
              Your adventure is just around the corner!<br />
              A confirmation has been sent to your email with<br />
              all the details of your stay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmPage;