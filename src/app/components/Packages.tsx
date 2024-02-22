'use client';
import { useEffect, useState, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { fetchToken, trackByDate, TrackingResponse, Shipment } from '../api/gls';


interface PackagesProps {
    selectedDay: string | null; 
    onReferenceClick: (reference: string) => void;
    onShipmentDateChange: (newDate: string) => void;
}

const Packages = ({ selectedDay, onReferenceClick, onShipmentDateChange }: PackagesProps) => { 
    const [shipments, setShipments] = useState<TrackingResponse['ShipmentInfo']>([]);
    const [error, setError] = useState<string | null>(null);
    let [isOpen, setIsOpen] = useState(false);
    const shipmentDateInputRef = useRef<HTMLInputElement>(null);

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const host = process.env.NEXT_PUBLIC_GLS_HOST!;
                const username = process.env.NEXT_PUBLIC_GLS_USERNAME!;
                const password = process.env.NEXT_PUBLIC_GLS_PASSWORD!;
                const accountNumber = process.env.NEXT_PUBLIC_GLS_ACCOUNTNUMBER!;

                // Fetch token
                const tokenResponse = await fetchToken(host, password, username);
                const token = tokenResponse.token;

                // Fetch shipments
                if (!selectedDay) { 
                    return Error('No shipment date');
                }
                const shipmentResponse = await trackByDate(host, accountNumber, token, selectedDay); 
                const data = shipmentResponse.ShipmentInfo;

                setShipments(data);
                setError(null);
            } catch (error) {
                setError('Error fetching data');
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();
    }, [selectedDay, onShipmentDateChange]); 

    const shipmentsByReference: { [key: string]: Shipment[] } = {};
    shipments.forEach(shipment => {
        if (!shipmentsByReference[shipment.ShipmentReference]) {
            shipmentsByReference[shipment.ShipmentReference] = [];
        }
        shipmentsByReference[shipment.ShipmentReference].push(shipment);
    });

    const handleFindShipments = () => {
        const newShipmentDate = shipmentDateInputRef.current?.value ?? '';
        if (newShipmentDate) {
            onShipmentDateChange(newShipmentDate);
            closeModal();
        }
    };

    return (
        <div>
            {error ? (
                <p>{error}</p>
            ) : (
                <div>
                    <div className="border border-gray-200 p-4">
                        Ship Date 
                        <div className="flex items-center">
                            <button
                                type="button"
                                onClick={openModal}
                                className="rounded-md w-full p-2 m-2 bg-black/70 px-4 py-2 text-md font-medium text-white hover:bg-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                            >
                                {selectedDay}
                            </button>
                        </div>

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
                                                            ref={shipmentDateInputRef}
                                                            max={new Date().toISOString().split('T')[0]}
                                                        />
                                                    </p>
                                                </div>

                                                <div className="mt-4">
                                                    <button
                                                        type="button"
                                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                        onClick={handleFindShipments}
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


                    {Object.entries(shipmentsByReference).map(([reference, shipments]) => (
                        <div key={reference} 
                            className="border border-gray-200 p-4"
                            onClick={() => onReferenceClick(reference)}>
                            <p className='font-semibold font-2xl'>ORDER# {reference}</p>
                            {shipments.map((shipment, index) => (
                                <div key={index}>
                                    {index === 0 && (
                                        <>
                                            <p className='pb-2'>{shipment.ShipToCompany}</p>
                                            <p className='text-slate-500 text-sm font-semibold'>Packages</p>
                                        </>
                                    )}
                                    <p>{shipment.TrackingNumber}</p>
                                </div>
                            ))}
                        </div>


                    ))}
                </div>
            )}
        </div>
    );
};

export default Packages;
