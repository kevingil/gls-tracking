import { Fragment, useState } from 'react';
import { Filter } from '../api/gls';
import { useSearch } from '../context/SearchContext';

interface SearchProps {
  onDayChange: (day: string) => void;
  selectedDay: string | null;
}

const Search: React.FC<SearchProps> = ({ onDayChange, selectedDay }) => {
  const { searchTerm, setSearchTerm, filter, setFilter } = useSearch();
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
    onDayChange(newDate);
  };

  return (
    <div className="text-white bg-[#124280]">
      <div className='mx-auto flex flex-col w-full max-w-7xl gap-1 p-3 sm:px-4'>

        <div className='flex sm:flex-row sm:gap-12 gap-2 flex-col w-full text-xl'>
        <p className='text-2xl m-auto'>
        <svg xmlns="http://www.w3.org/2000/svg" className='h-6 w-6 inline m-2 fill-white' viewBox="0 0 640 512"><path d="M58.9 42.1c3-6.1 9.6-9.6 16.3-8.7L320 64 564.8 33.4c6.7-.8 13.3 2.7 16.3 8.7l41.7 83.4c9 17.9-.6 39.6-19.8 45.1L439.6 217.3c-13.9 4-28.8-1.9-36.2-14.3L320 64 236.6 203c-7.4 12.4-22.3 18.3-36.2 14.3L37.1 170.6c-19.3-5.5-28.8-27.2-19.8-45.1L58.9 42.1zM321.1 128l54.9 91.4c14.9 24.8 44.6 36.6 72.5 28.6L576 211.6v167c0 22-15 41.2-36.4 46.6l-204.1 51c-10.2 2.6-20.9 2.6-31 0l-204.1-51C79 419.7 64 400.5 64 378.5v-167L191.6 248c27.8 8 57.6-3.8 72.5-28.6L318.9 128h2.2z"/></svg>
          Packages
        </p>
          <input
            type='search'
            placeholder='Find by name, reference, city, etc'
            className="pl-4 p-2 m-2 bg-white rounded-full text-sm text-black flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className='flex sm:flex-row flex-col gap-2 justify-between '>
          <div className='flex sm:flex-row flex-col'>
            <span className='inline text-sm mx-2 my-auto'>Date:</span>
            <input
              type="date"
              id="shipmentdateinput"
              name="shipmentdateinput"
              className='m-1'
              max={new Date().toISOString().split('T')[0]}
              value={selectedDay || ''}
              onChange={handleDaySelection} />
          </div>
          <div className='flex filters'>
          <button onClick={() => setFilter('all')} className={filter === 'all' ? 'selected-filter' : ''}>All</button>
          <button onClick={() => setFilter('intransit')} className={filter === 'intransit' ? 'selected-filter' : ''} style={{ whiteSpace: 'nowrap' }}>In Transit</button>
          <button onClick={() => setFilter('late')} className={filter === 'late' ? 'selected-filter' : ''}>Late</button>
          <button onClick={() => setFilter('exception')} className={filter === 'exception' ? 'selected-filter' : ''}>Exception</button>
          <button onClick={() => setFilter('delivered')} className={filter === 'delivered' ? 'selected-filter' : ''}>Delivered</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Search;
