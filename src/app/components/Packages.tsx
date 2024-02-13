import { useEffect, useState } from 'react';

interface GLSDataItem {
    AccountNumber: number;
    TrackingNumber: string;
    // Add other properties here based on your data structure
}

const Packages = () => {
    const [glsData, setGlsData] = useState<GLSDataItem[]>([]);

    useEffect(() => {
        const fetchGLSData = async () => {
            try {
                const response = await fetch('/api/gls', {
                    method: 'POST',
                    // Add any necessary headers or body here
                    // Example: body: JSON.stringify({ /* request body */ })
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch GLS data');
                }
                const data = await response.json();
                setGlsData(data);
            } catch (error) {
                console.error('Error fetching GLS data:', error);
                // Handle error
            }
        };

        fetchGLSData();
    }, []);

    return (
        <div>
            {/* Render your GLS data here */}
            {glsData.map((item) => (
                <div key={item.TrackingNumber}>
                    {/* Render each GLS data item */}
                    <p>Tracking Number: {item.TrackingNumber}</p>
                    {/* Render other properties as needed */}
                </div>
            ))}
        </div>
    );
};

export default Packages;
