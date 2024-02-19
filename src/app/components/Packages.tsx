'use client';
import { useEffect, useState } from 'react';
import { fetchToken, trackShipment, Shipment, Token, TransitNote } from '../api/gls';

interface PackagesProps {
    shipmentDate: string;
}

const Packages = ({ shipmentDate }: PackagesProps) => {
    const [shipments, setShipments] = useState<Shipment[]>([]);
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
                //This is wrong, use for now
                const data = shipmentResponse;

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
                    {shipments.map((shipment) => (
                        <div key={shipment.TrackingNumber}>
                            <p>Tracking Number: {shipment.TrackingNumber}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Packages;
