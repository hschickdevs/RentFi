import React from 'react';
import './sign.css'; // Import your CSS file for styling

function Sign() {
  const handleLedger = () => {
    // TODO add function call to updateLeaseStatus from factory lease agreement
    // TODO add function call to activateLease
    window.location.href = '/ledger'; // Directly changing the URL
  };

  return (
    <div className="property-page">
      <div className="header">
        <h1>Property Details</h1>
      </div>
      <div className="property-info">
        <h2>123 Main Street</h2>
        <p>Price: $500,000</p>
        <p>Bedrooms: 3</p>
        <p>Bathrooms: 2</p>
        {/* Add more property details here */}
      </div>
      <div className="property-images">
        {/* Add property images here */}
      </div>
      <div className="action-buttons">
        <button onClick={handleLedger}>Sign Lease</button>
      </div>
    </div>
  );
}

export default Sign;
