'use client';
import { useEffect, useState } from 'react';
import { fetchToken, trackShipment, TrackingResponse, Shipment } from '../api/gls';

interface PackagesProps {
    shipmentDate: string;
}

const Packages = ({ shipmentDate }: PackagesProps) => {

    const [shipments, setShipments] = useState<TrackingResponse['ShipmentInfo']>([]);
    const [error, setError] = useState<string | null>(null);

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
                const shipmentResponse = await trackShipment(host, accountNumber, shipmentDate, token);
                const data = shipmentResponse.ShipmentInfo;

                setShipments(data);
                setError(null);
            } catch (error) {
                setError('Error fetching data');
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();
    }, [shipmentDate]);

    const shipmentsByReference: { [key: string]: Shipment[] } = {};
    shipments.forEach(shipment => {
        if (!shipmentsByReference[shipment.ShipmentReference]) {
            shipmentsByReference[shipment.ShipmentReference] = [];
        }
        shipmentsByReference[shipment.ShipmentReference].push(shipment);
    });

    return (
        <div>
            <p className="text-2xl font-semibold p-4">GLS Shipments</p>
            {error ? (
                <p>{error}</p>
            ) : (
                <div>
                    {Object.entries(shipmentsByReference).map(([reference, shipments]) => (
                        <div key={reference} className="border border-gray-200 p-4 mb-4">
                            <p className='font-semibold font-2xl'>PO: {reference}</p>
                            {shipments.map((shipment, index) => (
                                <div key={index}>
                                    {index === 0 && (
                                        <>
                                            <p>Customer: {shipment.ShipToCompany}</p>
                                            {/* Add other customer details if needed */}
                                        </>
                                    )}
                                    <p>Tracking Number: <a className='text-blue-500 hover:text-blue-700' href={`https://gls-us.com/track-and-trace?TrackingNumbers=${shipment.TrackingNumber}`}>{shipment.TrackingNumber}</a></p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Export Packages component
export default Packages;
