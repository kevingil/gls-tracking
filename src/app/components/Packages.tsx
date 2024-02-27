'use client';
import { useEffect, useState, useRef } from 'react';
import { TrackingResponse, Shipment, fetchToken, trackByDate } from '../api/gls';


interface PackagesProps {
    selectedDay: string | null;
    shipments: TrackingResponse['ShipmentInfo'];
    error: string | null;
    onReferenceClick: (reference: string) => void;
}

const Packages: React.FC<PackagesProps> = ({
    selectedDay,
    onReferenceClick,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const shipmentDateInputRef = useRef<HTMLInputElement>(null);
    const [shipments, setShipments] = useState<TrackingResponse['ShipmentInfo']>([]);
    const [error, setError] = useState<string | null>(null);

    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
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
                setError('No shipments found for ' + selectedDay);
                console.error('Error fetching data');
            }
        };

        fetchData();
    }, [selectedDay]);

    const shipmentsByReference: { [key: string]: Shipment[] } = {};
    shipments.forEach(shipment => {
        if (!shipmentsByReference[shipment.ShipmentReference]) {
            shipmentsByReference[shipment.ShipmentReference] = [];
        }
        shipmentsByReference[shipment.ShipmentReference].push(shipment);
    });

    return (
        <div>
            {error ? (
                <p className='font-semibold text-md stext-center p-4'>{error}</p>
            ) : (
                <div>
                    {Object.entries(shipmentsByReference).map(([reference, shipments]) => (
                        <div
                            key={reference}
                            className="border border-gray-200 p-4"
                            onClick={() => onReferenceClick(reference)}
                        >
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
