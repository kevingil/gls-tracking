'use client';

import { useEffect, useState } from 'react';
import { GLS_APIURL, GLS_ACCOUNTNUMBER, GLS_USERNAME, GLS_PASSWORD } from '../api/api';

export type Recipient = {
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

export type Shipment = {
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
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const fetchShipments = async () => {
            try {
                if (!shipmentDate) {
                    setError('Shipment date is required.');
                    return;
                }

                let token: Token | null = getTokenFromLocalStorage();
                if (!token || isTokenExpired(token)) {
                    token = await fetchToken();
                    saveTokenToLocalStorage(token.token, 12 * 60 * 60);
                }

                const data = await TrackShipment(shipmentDate, token.token);
                setShipments([data]);
                setError(null);
            } catch (error) {
                setError('Error fetching GLS data');
                console.error('Error fetching GLS data:', error);
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
    async function fetchToken(): Promise<Token> {
        console.log("Fetch token: " + GLS_APIURL);
        try {
            const response = await fetch(`${GLS_APIURL}/token`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${btoa(`${GLS_USERNAME}:${GLS_PASSWORD}`)}`
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
            const response = await fetch(`${GLS_APIURL}/TrackShipment?AccountNumber=${GLS_ACCOUNTNUMBER}&ShipDate=${shipmentDate}`, {
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
