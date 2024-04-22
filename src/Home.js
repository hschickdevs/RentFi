import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    // Use useEffect to redirect or perform some initial logic
    React.useEffect(() => {
        // This will navigate to the root path, which should be handled by App.js
        navigate('/');
    }, [navigate]);

    return null;  // This component doesn't render anything itself
}

export default Home;
