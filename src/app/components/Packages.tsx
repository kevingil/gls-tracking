'use client';

import { hostname } from 'os';
import { useEffect, useState } from 'react';

type Recipient = {
  ShipToCompany: string;
  ShipToAttention: string;
  ShipToPhone: string;
  DeliveryAddress1: string;
  DeliveryAddress2: string;
  DeliveryCity: string;
  DeliveryState: string;
  DeliveryZip: string;
  Shipments: Shipment[];
}

type Shipment = {
  TrackingNumber: string;
  TotalCharge: number;
  ShipDate: string;
  ServiceCode: string;
  ShipmentReference: string;
  DeclaredValue: string;
  CODValue: string;
  SpecialInstructions: string;
  Weight: string;
  SignatureCode: string;
  AddnShipperReference1: string;
  AddnShipperReference2: string;
  PODImage: string;
  PODImageMessage: string;
  ScheduledDeliveryDate: string;
  ScheduledDeliveryTime: string;
  DeliveryDate: string;
  TransitStatus: string;
  DeliveryTime: string;
  SignedBy: string;
  Signature: string;
  TransitNotes: TransitNote[];
};

type TransitNote = {
  EventDate: string;
  Comments: string;
  Location: string;
};

interface PackagesProps {
    shipmentDate: string; 
}

type Token = {
    token: string;
    expirationTime: number;
}

const Packages = ({ shipmentDate }: PackagesProps) => {

    const username = process.env.NEXT_PUBLIC_GLS_USERNAME;
    const password = process.env.NEXT_PUBLIC_GLS_PASSWORD;
    const accountNumber = process.env.NEXT_PUBLIC_GLS_ACCOUNTNUMBER;
    const host = process.env.NEXT_PUBLIC_GLS_HOST;

    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchShipments = async () => {
            let token: Token | null = getTokenFromLocalStorage();
    
            if (!shipmentDate) {
                setError('Shipment date is required.');
                return;
            }
    
            if (!token || isTokenExpired(token)) {
                if (username && password) {
                    try {
                        token = await fetchToken(username, password);
                        if (token) {
                            saveTokenToLocalStorage(token.token, 12 * 60 * 60);
                        } else {
                            throw new Error('Error prasing token.');
                        }
                    } catch (error) {
                        setError('Error fetching token');
                        console.error('Error fetching token: ', error);
                        return;
                    }
                } else {
                    setError('Username and password are required.');
                    return;
                }
            }
    
            try {
                if (token && token.token) {
                    const data = await TrackShipment(shipmentDate, token.token);
                    setShipments([data]);
                    setError(null);
                } else {
                    throw new Error('Invalid token.');
                }
            } catch (error) {
                setError('Error tracking shipment');
                console.error('Error tracking shipment: ', error);
            }
        };
    
        fetchShipments();
    }, [shipmentDate]);
    

    function getTokenFromLocalStorage(): Token | null {
        const tokenData = JSON.parse(localStorage.getItem('gls_token') || 'null');
        return tokenData;
    }

    function saveTokenToLocalStorage(token: string, expiresIn: number): void {
        const expirationTime = new Date().getTime() + expiresIn * 1000;
        localStorage.setItem('gls_token', JSON.stringify({ token, expirationTime }));
    }

    function isTokenExpired(tokenData: Token | null): boolean {
        return !tokenData || tokenData.expirationTime < new Date().getTime();
    }

    // Fetch the token
    async function fetchToken(p: string, u: string): Promise<Token> {
        console.log("Fetch token: " + process.env.NEXT_PUBLIC_GLS_HOST);
        try {
            const response = await fetch(`https://${host}/token`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Username': p,
                    'Password': u
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch token');
            }

            const token = response.headers.get('Token');
            const expirationTime = Date.parse(response.headers.get('TokenExpiry') || '');

            if (!token || isNaN(expirationTime)) {
                throw new Error('Invalid token');
            }

            return {
                token: token,
                expirationTime: expirationTime
            };
        } catch (error) {
            console.error('Error fetching token:', error);
            throw new Error('Error fetching token');
        }
    }



    // Track shipment
    async function TrackShipment(shipmentDate: string, token: string): Promise<Shipment> {
        console.log("Track shipment");
        try {
            const response = await fetch(`https://${process.env.NEXT_PUBLIC_GLS_HOST}/TrackShipment?AccountNumber=${process.env.NEXT_PUBLIC_GLS_ACCOUNTNUMBER}&ShipDate=${shipmentDate}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data: Shipment = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching shipment:', error);
            throw new Error('Error fetching shipment');
        }
    }

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
