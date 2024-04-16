import React from 'react';
import './ledger.css'; // Import your CSS file for styling

function Ledger() {
  return (
    <div className="my-rentals-page">
      <div className="header">
        <h1>My Rentals / My Leases</h1>
      </div>
      <div className="rentals-list">
        {/* Render your list of rentals/leases here */}
        <div className="rental-item">
          <h2>123 Main Street</h2>
          <p>Lease Start Date: January 1, 2024</p>
          <p>Lease End Date: December 31, 2024</p>
          {/* Add more rental/lease details here */}
        </div>
      </div>
    </div>
  );
}

export default Ledger;
