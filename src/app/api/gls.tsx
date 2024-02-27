'use server';

export type Token = {
    token: string;
    expirationTime: number;
}
export type TrackingResponse = {
    ShipmentInfo: Shipment[];
    StatusCode: number;
    StatusDescription: string;
    AuthenticationResultCode: number;
    RequestDateTime: string;
    ResponseDateTime: string;
    ErrorCount: number;
    ErrorDetail: any; 
};

export type Shipment = {
    AccountNumber: number;
    TrackingNumber: string;
    ShipperCompany: string;
    ShipperContact: string;
    ShipperPhone: string;
    ShipperEmail: string;
    PickupAddress1: string;
    PickupAddress2: string;
    PickupCity: string;
    PickupState: string;
    PickupZip: string;
    ShipToCompany: string;
    ShipToAttention: string;
    ShipToPhone: string;
    ShipToEmail: string;
    DeliveryAddress1: string;
    DeliveryAddress2: string;
    DeliveryCity: string;
    DeliveryState: string;
    DeliveryZip: string;
    DeliveryZone: number;
    ServiceCode: string;
    ShipmentReference: string;
    DeclaredValue: number;
    CODValue: number;
    SpecialInstructions: string;
    Weight: number;
    SignatureCode: string;
    AddnShipperReference1: string;
    AddnShipperReference2: string;
    PODImage: string;
    PODImageMessage: string;
    Delivery: DeliveryInfo;
    TransitNotes: TransitNote[];
    ShipmentCharges: ShipmentCharges;
    Tag: string | null;
};

export type DeliveryInfo = {
    ShipDate: string;
    ScheduledDeliveryDate: string;
    ScheduledDeliveryTime: string;
    DeliveryDate: string;
    TransitStatus: string;
    DeliveryTime: string;
    SignedBy: string;
    Signature: string | null; 
};

export type TransitNote = {
    EventDate: string;
    Comments: string;
    Location: string;
};

export type ShipmentCharges = {
    TransportationCharge: number;
    CODCharge: number;
    InsuranceCharge: number;
    FuelSurcharge: number;
    OtherCharge: any[]; 
    TotalCharge: number;
};

export type Filter = {
    searchTerm: string;
    reference: string;
    date: string;
    all: boolean;
    intransit: boolean;
    late: boolean;
    exception: boolean;
    delivered: boolean;
}


async function fetchToken(h: string, p: string, u: string): Promise<Token> {
    try {
        const response = await fetch(`https://${h}/token`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Username': u,
                'Password': p
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
        throw new Error('Could not fetch token');
    }
}


async function track(h: string, acctnum: string, token: string, filter: Filter): Promise<TrackingResponse> {

    try {
        const response = await fetch(`https://${h}/TrackShipment?AccountNumber=${acctnum}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Token': token
            }
        });
        if (!response.ok) {
            console.log(response);
            throw new Error('Failed to fetch shipment');
        }
        const data: TrackingResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching shipment:', error);
        throw new Error('Error fetching shipment');
    }
}

async function trackByDate(h: string, acctnum: string, token: string, shipmentDate: string): Promise<TrackingResponse> {
    try {
        const response = await fetch(`https://${h}/TrackShipment?AccountNumber=${acctnum}&ShipDate=${shipmentDate}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Token': token
            }
        });
        if (!response.ok) {
            console.log(response);
            throw new Error('Failed to parse shipment');
        }
        const data: TrackingResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching shipment:', error);
        throw new Error('Error fetching shipment');
    }
}

async function trackByReference(h: string, acctnum: string, token: string, reference: string): Promise<TrackingResponse> {
    try {
        const response = await fetch(`https://${h}/TrackShipment?AccountNumber=${acctnum}&ReferenceNumber=${reference}&IncludeVPOD=true`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Token': token
            }
        });
        if (!response.ok) {
            throw new Error('Failed to parse shipment');
        }
        const data: TrackingResponse = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching shipment:', error);
        throw new Error('Error fetching shipment');
    }
}

async function getImagePOD(h: string, acctnum: string, token: string, trackingNumber: string): Promise<string | null> {
    try {
        const response = await fetch(`https://${h}/TrackShipment?AccountNumber=${acctnum}&TrackingNumber=${trackingNumber}&IncludeVPOD=true`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Token': token
            }
        });
        if (!response.ok) {
            throw new Error('Failed to parse image POD');
        }
        const data: TrackingResponse = await response.json();
        return data.ShipmentInfo[0].PODImage;
    } catch (error) {
        console.error('Failed to fetch image POD:', error);
        throw new Error('Failed to fetch image POD');
    }
}

//Test
async function tagShipment(box: Shipment): Promise<string> {
    let tag = 'In Transit';
    let today = new Date();
    let shipdate = box.Delivery.ShipDate;
    let expected = box.Delivery.ShipDate;
    let scheduled = box.Delivery.ScheduledDeliveryDate;
    let transitstatus = box.Delivery.TransitStatus;
    
    return tag;
}



export { fetchToken, trackByDate, trackByReference};
