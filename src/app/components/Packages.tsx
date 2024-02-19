'use client';
import { useEffect, useState } from 'react';
import { fetchToken, trackShipment, TrackingResponse } from '../api/gls';

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

    return (
        <div>
            <p className="text-2xl font-semibold p-4">Shipments</p>
            {error ? (
                <p>{error}</p>
            ) : (
                <div>
                    {shipments.map((shipment, index) => (
                        <div key={index} className="border border-gray-200 p-4 mb-4">
                            <p className="font-semibold">Tracking Number: {shipment.TrackingNumber}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Export Packages component
export default Packages;
