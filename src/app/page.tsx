'use client';
import React, { useState } from 'react';
import AccountNav from "../app/components/AccountNav";
import Packages from "../app/components/Packages";
import ReferenceDetail from "../app/components/ReferenceDetail";

function getPreviousBusinessDay() {
  const date = new Date();
  const dayOfWeek = date.getDay();
  
  if (dayOfWeek === 0) {
      date.setDate(date.getDate() - 2); 
  } else if (dayOfWeek === 1) {
      date.setDate(date.getDate() - 3); 
  } else {
      date.setDate(date.getDate() - 1); 
  }

  const month = date.getMonth() + 1; 
  const day = date.getDate();
  const year = date.getFullYear();

  const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;

  return formattedDate;
}

export default function Home() {
  const previousBusinessDay = getPreviousBusinessDay(); 
  const [selectedReference, setSelectedReference] = useState<string | null>(null);

  const handleReferenceClick = (reference: string) => {
    setSelectedReference(reference);
  };

  return (
    <div className="w-full h-full">
      <div className="text-white bg-[#124280] p-4">
        <p className="text-3xl">GLS Tracking Dashboard</p>
      </div>
      <div>
        <p className="text-2xl font-semibold p-4">Shipments</p>
      </div>
      <div className="flex flex-row gap-2 px-2 flex-grow text-black">
        <div className='w-full h-full max-w-[15rem]'>
            <AccountNav />
        </div>
        <div className="w-full h-full max-w-[25rem]">
          <Packages 
            shipmentDate={previousBusinessDay} 
            onReferenceClick={handleReferenceClick}
          />
        </div>
        <div className="w-full">
        <ReferenceDetail date={previousBusinessDay} reference={selectedReference}/>
        </div>
      </div>
    </div>
  );
}
