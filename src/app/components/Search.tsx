import { Fragment, useState } from 'react';
import { Filter } from '../api/gls';
import { Dialog, Transition } from '@headlessui/react';

interface SearchProps {
  onFilterChange: (filter: Filter) => void;
}

const Search: React.FC<SearchProps> = ({ onFilterChange }) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleFilterClick = (filterName: keyof Filter) => {
    const newFilter: Filter = {
      searchTerm: '',
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
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
</svg>

        </button>
      </div>
      <div className='mx-auto flex justify-between w-full mt-4 max-w-7xl gap-4 px-4'>
        <div>
          <p className=''>Date: </p>
          <button
            type="button"
            className="py-2 px-4 text-2xl font-medium hover:text-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
            onClick={openModal}
          >
            {selectedDay}
          </button>
          <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/25" />
              </Transition.Child>
              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Find By Date
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          <input
                            type="date"
                            id="shipmentdateinput"
                            name="shipmentdateinput"
                            max={new Date().toISOString().split('T')[0]}
                          />
                        </p>
                      </div>
                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex justify-center border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          Find Shipments
                        </button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
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
