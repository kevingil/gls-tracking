'use client';
import { useEffect, useState, useRef } from 'react';
import { TrackingResponse, Shipment, fetchToken, trackByDate, Filter } from '../api/gls';
import { useSearch } from '../context/SearchContext';



interface PackagesProps {
    selectedDay: string | null;
    selectedFilter: Filter;
    shipments: TrackingResponse['ShipmentInfo'];
    error: string | null;
    onReferenceClick: (reference: string) => void;
}

const Packages: React.FC<PackagesProps> = ({
    selectedDay,
    onReferenceClick,
}) => {
    const [shipments, setShipments] = useState<TrackingResponse['ShipmentInfo']>([]);
    const [error, setError] = useState<string | null>(null);
    const { searchTerm } = useSearch();


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

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filteredShipmentsArray = shipments.filter(shipment => 
        shipment.ShipToCompany.toLowerCase().includes(lowerCaseSearchTerm) ||
        shipment.DeliveryAddress1.toLowerCase().includes(lowerCaseSearchTerm) ||
        shipment.ShipmentReference.toLowerCase().includes(lowerCaseSearchTerm)
    );
    
    const structuredShipments: { [key: string]: Shipment[] } = {};
    filteredShipmentsArray.forEach(shipment => {
        const reference = shipment.ShipmentReference;
        if (!structuredShipments[reference]) {
            structuredShipments[reference] = [];
        }
        structuredShipments[reference].push(shipment);
    });


    return (
        <div className="w-[25rem] overflow-y-scroll">
            {error ? (
                <p className='font-semibold text-md text-center p-4'>{error}</p>
            ) : (
                <div>
                    {Object.entries(structuredShipments).map(([reference, shipments]) => (
                        <div
                            key={reference}
                            className="border border-gray-200 p-4 cursor-pointer hover:bg-gray-100"
                            onClick={() => onReferenceClick(reference)}
                        >
                            <p className='font-semibold text-2xl'>ORDER {reference}</p>
                            {shipments.map((shipment, index) => (
                                <div key={index}>
                                    {index === 0 && (
                                        <p className='pb-2'>{shipment.ShipToCompany}</p>
                                    )}
                                    <div className='flex flex-col'>
                                        <div className='pb-1'>
                                            <span className={`${shipment.Tag.Color} ${shipment.Tag.Background} text-xs flex-wrap font-semibold capitalize rounded px-2 py-0.5`}>{shipment.Tag.Name}</span>
                                        </div>
                                        <p>{shipment.TrackingNumber}</p>
                                    </div>
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
