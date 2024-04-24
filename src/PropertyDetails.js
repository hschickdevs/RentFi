import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PropertyDetails = () => {
  const location = useLocation();
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const property = location.state?.property;

  useEffect(() => {
    if (!property || !property.NftUri) {
      console.error('Property details not provided');
      setLoading(false);
      return;
    }

    const fetchPropertyDetails = async () => {
      try {
        const response = await fetch(property.NftUri);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPropertyDetails(data);
      } catch (error) {
        console.error('Error fetching property data:', error);
        setPropertyDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [property]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!propertyDetails) {
    return <div>Property details not found.</div>;
  }

  return (
    <div className="property-details" style={{ fontFamily: 'Arial, sans-serif', color: '#333', maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '20px' }}>
      <img
        src={propertyDetails.images[0]}
        alt={propertyDetails.name || 'Property'}
        style={{ width: '50%', height: 'auto', borderRadius: '8px' }}
      />
      <div style={{ width: '50%' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'normal', marginBottom: '10px', textAlign: 'center' }}>{propertyDetails.name}</h2>
        <div style={{ textAlign: 'left', padding: '0 20px' }}>
          <p>Token ID: {property?.tokenId}</p>
          <p>Owner: {property?.owner}</p>
          <p>Status: {property?.state}</p>
          <p>Lease Price: {property?.rentalPrice}</p>
          <p>Deposit: {property?.depositAmount}</p>
          <p>Duration: {property?.leaseDuration}</p>
          <p>Tenant Address: {property?.tenant}</p>
        </div>
        {/* ... other details ... */}
      </div>
    </div>
  );
};

export default PropertyDetails;
