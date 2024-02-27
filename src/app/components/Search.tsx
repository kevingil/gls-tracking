import { Fragment, useState } from 'react';
import { Filter } from '../api/gls';
import { Dialog, Transition } from '@headlessui/react';

interface SearchProps {
  onFilterChange: (filter: Filter) => void;
  onDayChange: (day: string) => void;
  selectedDay: string | null;
}

const Search: React.FC<SearchProps> = ({ onFilterChange, onDayChange, selectedDay }) => {

  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleDaySelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    closeModal();
    console.log(newDate);
    onDayChange(newDate);
  };

  const handleFilterClick = (filterName: keyof Filter) => {
    const newFilter: Filter = {
      searchTerm: '',
      reference: '',
      date: '',
      all: false,
      intransit: false,
      late: false,
      exception: false,
      delivered: false,
      [filterName]: true,
    };
    onFilterChange(newFilter);
  };

  return (
    <div className="text-white bg-[#124280]">
      <div className='mx-auto flex justify-between w-full max-w-7xl gap-4 pt-4 px-4'>
        <p className="text-3xl">Packages</p>
        <input type='search' placeholder='Find package' className="pl-4 bg-white rounded-full text-black flex-1" />
        <button type='submit' className="bg-white rounded-full text-black p-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>

        </button>
      </div>
      <div className='mx-auto flex justify-between w-full mt-4 max-w-7xl gap-4 px-4'>
        <div>
        <span className='inline'>Date:</span>
          <input
            type="date"
            id="shipmentdateinput"
            name="shipmentdateinput"
            className='font-sm mx-2 m-2'
            max={new Date().toISOString().split('T')[0]}
            value={selectedDay || ''}
            onChange={handleDaySelection}
          />

        </div>
        <div className='flex  text-xl'>
          <button onClick={() => handleFilterClick('all')} className=' bg-blue-700/50 hover:border-sky-300 text-white px-4 h-full'>All</button>
          <button onClick={() => handleFilterClick('intransit')} className='hover:border-sky-300 text-white px-4 h-full '>In Transit</button>
          <button onClick={() => handleFilterClick('late')} className=' hover:border-sky-300 text-white px-4 h-full '>Late</button>
          <button onClick={() => handleFilterClick('exception')} className='hover:border-sky-300 text-white px-4 h-full '>Exception</button>
          <button onClick={() => handleFilterClick('delivered')} className='hover:border-sky-300 text-white px-4 h-full '>Delivered</button>
        </div>
      </div>
    </div>
  );
}

export default Search;
