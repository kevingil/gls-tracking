import { Fragment, useState } from 'react';
import { Filter } from '../api/gls';
import { useSearch } from '../context/SearchContext';

interface SearchProps {
  onFilterChange: (filter: Filter) => void;
  onDayChange: (day: string) => void;
  selectedDay: string | null;
}

const Search: React.FC<SearchProps> = ({ onFilterChange, onDayChange, selectedDay }) => {
  const { searchTerm, setSearchTerm } = useSearch();

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

  const handleFilterClick = (category: string) => {
    const newFilter: Filter = {
      searchTerm: '',
      reference: '',
      shipdate: '',
      category: category,
    };
    onFilterChange(newFilter);
  };

  return (
    <div className="text-white bg-[#124280]">
      <div className='mx-auto flex justify-between w-full mt-4 max-w-7xl gap-4 px-4'>
        <p className='text-3xl'>Packages</p>
        <div>
          <span className='inline text-xl mr-2'>Date:</span>
          <input
            type="date"
            id="shipmentdateinput"
            name="shipmentdateinput"
            className='mx-2 m-2'
            max={new Date().toISOString().split('T')[0]}
            value={selectedDay || ''}
            onChange={handleDaySelection}
          />

        </div>
      </div>
      <div className='mx-auto flex justify-between w-full mt-4 max-w-7xl gap-4 px-4'>
        
        <div className='flex w-full text-xl'>
          <input
            type='search'
            placeholder='Find package'
            className="pl-4 m-2 bg-white rounded-full text-black flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          /></div>
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
