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
                    <p className="font-semibold font-2xl">Shipment Detail</p>
                    <p className='px-2 text-5xl tracking-tighter'>PO {reference}</p>
                    {shipments.length > 0 && (
                        <div className='flex flex-row p-2 gap-4'>
                            <div>
                                <p>Customer: </p>
                                <p className='font-bold'>{shipments[0].ShipToCompany}</p>
                                <p>{shipments[0].ShipToAttention}</p>
                                <p>{shipments[0].ShipToPhone}</p>
                                <p>{shipments[0].ShipToEmail}</p>
                                <p>{shipments[0].DeliveryAddress1}</p>
                                <p>{shipments[0].DeliveryAddress2}</p>
                                <p>{shipments[0].DeliveryCity}, {shipments[0].DeliveryState} {shipments[0].DeliveryZip}</p>
                            </div>
                        </div>
                    )}
                    {shipments.map((shipment, index) => (
                        <div key={index} className='border border-gray-200 p-2' >
                            <p className='text-lg pb-1'>Tracking: {shipment.TrackingNumber} </p>
                           <div className='flex flex-row gap-6 pb-1'>
                                <div className=''>
                                    <p>Status: {shipment.Delivery.TransitStatus}</p>
                                    <p>Shipment Charges: {shipment.ShipmentCharges.TotalCharge}</p>
                                    <p>Service: {shipment.ServiceCode}</p>
                                    <p>Weight: {shipment.Weight}</p>
                                    <p>Signature Code: {shipment.SignatureCode}</p>
                                </div>
                                <div className=''>
                                    <p>POD Image: {shipment.PODImage}</p>
                                    <p>POD Image Message: {shipment.PODImageMessage}</p>
                                    <p>Delivery Date: {shipment.Delivery.DeliveryDate}</p>
                                    <p>Signed By: {shipment.Delivery.SignedBy}</p>
                                </div>
                            </div>
                            <ul className='p-2 bg-gray-100 rounded'>
                                {shipment.TransitNotes.map((note, idx) => (
                                    <li key={idx}>{note.Comments}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReferenceDetail;
