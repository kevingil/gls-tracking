'use client';
import React, { useState } from 'react';
import Search from "./components/Search";
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
  const [selectedReference, setSelectedReference] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const previousBusinessDay = getPreviousBusinessDay();

  if (!selectedDay) {
    setSelectedDay(previousBusinessDay);
  }

  const handleReferenceClick = (reference: string) => {
    setSelectedReference(reference);
  };

  const handleDayChange = (newDate: string) => {
    setSelectedDay(newDate);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Search/>
      <div className="flex flex-1 mx-auto  w-full  max-w-7xl overflow-y-scroll">
        <div className="w-[25rem] overflow-auto">
          <Packages
            selectedDay={selectedDay}
            onReferenceClick={handleReferenceClick}
            onShipmentDateChange={handleDayChange}
          />
        </div>
        <div className="flex-1 w-full overflow-auto">
          <ReferenceDetail date={previousBusinessDay} reference={selectedReference} />
        </div>
      </div>

    </div>
  );
}
