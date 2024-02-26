import { Transition, Dialog } from "@headlessui/react";
import { Fragment, useState } from 'react';

function Search() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <div className="text-white bg-[#124280] p-4">
      <div className='mx-auto flex justify-between w-full max-w-7xl gap-4'>
        <p className="text-3xl">GLS Tracking</p>
        <input type='search' className="bg-white rounded text-black flex-1" />
        <button type='submit' className="bg-white rounded text-black p-2">Search</button>
      </div>
      <div className='mx-auto flex justify-between w-full mt-4 max-w-7xl gap-4'>
        <div>
          <p className=''>Date: </p>
          <button
            type="button"
            className="rounded-md py-2 px-4 text-2xl font-medium hover:text-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
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
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
        <div className='flex gap-4 text-xl'>
          <button className='bg-white rounded-md border-2 border-sky-600 hover:border-sky-300 text-black px-2 h-fit my-auto'>All</button>
          <button className='bg-white rounded-md border-2 border-sky-600 hover:border-sky-300 text-black px-2 h-fit my-auto'>In Transit</button>
          <button className='bg-white rounded-md border-2 border-sky-600 hover:border-sky-300 text-black px-2 h-fit my-auto'>Late</button>
          <button className='bg-white rounded-md border-2 border-sky-600 hover:border-sky-300 text-black px-2 h-fit my-auto'>Exception</button>
          <button className='bg-white rounded-md border-2 border-sky-600 hover:border-sky-300 text-black px-2 h-fit my-auto'>Delivered</button>
        </div>
      </div>
    </div>
  );
}

export default Search;
