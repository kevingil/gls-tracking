import { useEffect, useState } from 'react';
import { TrackShipment } from '../api/gls';

interface GLSDataItem {
    TrackingNumber: string;
}

const Packages = () => {
    const [glsData, setGlsData] = useState<GLSDataItem[]>([]);

    useEffect(() => {
        const fetchGLSData = async () => {
            try {
                const shipmentDate = ''; 
                const data = await TrackShipment(shipmentDate);
                setGlsData([data]); 
            } catch (error) {
                console.error('Error fetching GLS data:', error);
            }
        };

        fetchGLSData();
    }, []);

    return (
        <div>
            {glsData.map((item) => (
                <div key={item.TrackingNumber}>
                    <p>Tracking Number: {item.TrackingNumber}</p>
                </div>
            ))}
        </div>
    );
};

export default Packages;
