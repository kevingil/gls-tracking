// ReferenceDetail.tsx

import React, { useEffect, useState } from 'react';
import { fetchToken, trackByReference, Shipment } from '../api/gls';

interface ReferenceDetailProps {
    date: string;
    reference: string | null;
}

const ReferenceDetail: React.FC<ReferenceDetailProps> = ({ date, reference }) => {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (reference) {
            const fetchData = async () => {
                try {
                    // Gather token
                    const host = process.env.NEXT_PUBLIC_GLS_HOST!;
                    const username = process.env.NEXT_PUBLIC_GLS_USERNAME!;
                    const password = process.env.NEXT_PUBLIC_GLS_PASSWORD!;
                    const accountNumber = process.env.NEXT_PUBLIC_GLS_ACCOUNTNUMBER!;

                    const tokenResponse = await fetchToken(host, password, username);
                    const token = tokenResponse.token;

                    // Fetch shipments for the selected reference
                    const shipmentResponse = await trackByReference(host, accountNumber, token, reference);
                    setShipments(shipmentResponse.ShipmentInfo);
                    setError(null);
                } catch (error) {
                    setError('Error fetching data for PO ' + reference);
                    console.error('Error fetching data: ', error);
                }
            };

            fetchData();
        }
    }, [reference]);

    return (
        <div>
            {error ? (
                <p className='p-4'>{error}</p>
            ) : (
                <div className="border border-gray-200 p-4 mb-4">
                    <p className="font-semibold font-2xl">Shipment Details for Reference: {reference}</p>

                    {shipments.map((shipment, index) => (
                        <div key={index} >
                            <div className='flex flex-row p-2 gap-4'>
                                <div>
                                    <p>Ship To: </p>
                                    <p>{shipment.ShipToCompany}</p>
                                    <p>{shipment.ShipToAttention}</p>
                                    <p>{shipment.ShipToPhone}</p>
                                    <p>{shipment.ShipToEmail}</p>
                                    <p>{shipment.DeliveryAddress1}</p>
                                    <p>{shipment.DeliveryAddress2}</p>
                                    <p>{shipment.DeliveryCity}, {shipment.DeliveryState} {shipment.DeliveryZip}</p>
                                    <p>Service: {shipment.ServiceCode}</p>
                                    <p>Declared Value: {shipment.DeclaredValue}</p>
                                    <p>COD Value: {shipment.CODValue}</p>
                                    <p>Special Instructions: {shipment.SpecialInstructions}</p>
                                </div>
                                <div className=''>
                                    <p>Weight: {shipment.Weight}</p>
                                    <p>Signature Code: {shipment.SignatureCode}</p>
                                    <p>POD Image: {shipment.PODImage}</p>
                                    <p>POD Image Message: {shipment.PODImageMessage}</p>
                                    <p>Delivery Date: {shipment.Delivery.DeliveryDate}</p>
                                    <p>Transit Status: {shipment.Delivery.TransitStatus}</p>
                                    <p>Signed By: {shipment.Delivery.SignedBy}</p>
                                </div>
                            </div>
                            
                            <p>Transit Notes:</p>
                            <ul className='p-2 bg-gray-100 rounded'>
                                {shipment.TransitNotes.map((note, idx) => (
                                    <li key={idx}>{note.Comments}</li>
                                ))}
                            </ul>
                            <p>Shipment Charges: {shipment.ShipmentCharges.TotalCharge}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReferenceDetail;
