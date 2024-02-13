import { useEffect, useState } from 'react';

// GLS response token
type TokenResponse = {
  token: string;
};

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
}

const GLS_APIURL = process.env.GLS_APIURL;
const GLS_ACCOUNTNUMBER = process.env.GLS_ACCOUNTNUMBER;
const GLS_USERNAME = process.env.GLS_USERNAME;
const GLS_PASSWORD = process.env.GLS_PASSWORD;

// Fetch the token
async function fetchToken(): Promise<string> {
  const response = await fetch(`${GLS_APIURL}/token`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${btoa(`${GLS_USERNAME}:${GLS_PASSWORD}`)}`
    }
  });
  const data: TokenResponse = await response.json();
  return data.token;
}

// Retrieve token from local storage
function getTokenFromLocalStorage(): { token: string; expirationTime: number } | null {
  return JSON.parse(localStorage.getItem('gls_token') || 'null');
}


// Save token and its expiration time to local storage
function saveTokenToLocalStorage(token: string, expiresIn: number): void {
  const expirationTime = new Date().getTime() + expiresIn * 1000;
  localStorage.setItem('gls_token', JSON.stringify({ token, expirationTime }));
}

// Check if the token is expired
function isTokenExpired(): boolean {
  const tokenData = getTokenFromLocalStorage();
  return !tokenData || tokenData.expirationTime < new Date().getTime();
}

// Track shipment
async function TrackShipment(shipmentDate: string): Promise<Shipment> {
  let token = getTokenFromLocalStorage()?.token;

  if (isTokenExpired()) {
    token = await fetchToken();
    saveTokenToLocalStorage(token, 12 * 60 * 60); // 12 hours expiration time
  }

  const response = await fetch(`${GLS_APIURL}/TrackShipment?AccountNumber=${GLS_ACCOUNTNUMBER}&ShipDate=${shipmentDate}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  return await response.json();
}

export { TrackShipment };
