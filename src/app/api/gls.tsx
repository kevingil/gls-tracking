import { useEffect, useState } from 'react';

const GLS_APIURL = process.env.GLS_APIURL;
const GLS_ACCOUNTNUMBER = process.env.GLS_ACCOUNTNUMBER;
const GLS_USERNAME = process.env.GLS_USERNAME;
const GLS_PASSWORD = process.env.GLS_PASSWORD;

// Fetch the token
async function fetchToken() {
  const response = await fetch(`${GLS_APIURL}/token`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${btoa(`${GLS_USERNAME}:${GLS_PASSWORD}`)}`
    }
  });
  const data = await response.json();
  return data.token;
}

// Retrieve token from local storage
function getTokenFromLocalStorage() {
  return JSON.parse(localStorage.getItem('gls_token'));
}

// Save token and its expiration time to local storage
function saveTokenToLocalStorage(token, expiresIn) {
  const expirationTime = new Date().getTime() + expiresIn * 1000;
  localStorage.setItem('gls_token', JSON.stringify({ token, expirationTime }));
}

// Check if the token is expired
function isTokenExpired() {
  const tokenData = getTokenFromLocalStorage();
  return !tokenData || tokenData.expirationTime < new Date().getTime();
}

// Track shipment
async function TrackShipment(shipmentDate) {
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
