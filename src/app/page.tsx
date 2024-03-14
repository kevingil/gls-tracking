'use client';
'use client';
import React, { useState } from 'react';
import Search from "./components/Search";
import Packages from "../app/components/Packages";
import ReferenceDetail from "../app/components/ReferenceDetail";
import { Filter, TrackingResponse } from '../app/api/gls';
import { SearchProvider } from './context/SearchContext';

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

  const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

  return formattedDate;
}

export default function Home() {
  const [selectedReference, setSelectedReference] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<Filter>({ searchTerm: '', reference: '', shipdate: '', category: 'all' });
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

  const handleFilterChange = (filter: Filter) => {
    setSelectedFilter(filter);
  };

  // Shipments fetched from API
  const shipments: TrackingResponse['ShipmentInfo'] = [];
  // Error state if something goes wrong during fetching
  const error: string | null = null;

  return (
    <SearchProvider>
    <div className="w-full h-full flex flex-col">
      <Search
        selectedDay={selectedDay}
        onDayChange={handleDayChange}
        onFilterChange={handleFilterChange}
      />
      <div className="flex flex-1 mx-auto  w-full max-w-7xl overflow-auto">
        <Packages
          selectedDay={selectedDay}
          shipments={shipments}
          error={error}
          onReferenceClick={handleReferenceClick}
          selectedFilter={selectedFilter} />
        <ReferenceDetail 
          date={previousBusinessDay}
          reference={selectedReference} />
      </div>
    </div>
    </SearchProvider>
  );
}
