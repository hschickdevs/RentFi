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
        setPropertyDetails(null); // It's important to set to null to handle the error state
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
    <div className="property-details">
      <img
        src={propertyDetails.image} // This assumes that the property details fetched include an image URL
        alt={propertyDetails.name || 'Property'}
        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
      />
      <h2>{propertyDetails.name}</h2>
      {/* Include the additional details assuming they exist on the property object */}
      <p>Token ID: {property?.tokenId}</p>
      <p>Owner: {property?.owner}</p>
      <p>Status: {property?.state}</p>
      <p>Lease Price: {property?.rentalPrice}</p>
      <p>Deposit: {property?.depositAmount}</p>
      <p>Duration: {property?.leaseDuration}</p>
      <p>Tenant Address: {property?.tenant}</p>
      {/* ... other details ... */}
    </div>
  );
};

export default PropertyDetails;