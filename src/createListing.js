import React from 'react';
import './App.css';

function CreateListing() {
  return (
    <div>
      <Navbar />
      <div className="container mt-3">
        <h2>Create Listing</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="tokenId" className="form-label">Token ID</label>
            <input type="number" className="form-control" id="tokenId" placeholder="Enter token ID" required />
            <div className="form-text">Enter the token ID of the property to be leased that has not been listed.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="rentalPrice" className="form-label">Rental Price</label>
            <input type="number" className="form-control" id="rentalPrice" placeholder="Enter rental price per period" required />
            <div className="form-text">Set the rental price per payment period.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="depositAmount" className="form-label">Deposit Amount</label>
            <input type="number" className="form-control" id="depositAmount" placeholder="Enter deposit amount" required />
            <div className="form-text">Specify the deposit required to secure the lease.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="leaseDuration" className="form-label">Lease Duration</label>
            <input type="number" className="form-control" id="leaseDuration" placeholder="Enter lease duration" required />
            <div className="form-text">Define the duration of the lease in payment periods.</div>
          </div>
          <button type="submit" className="btn btn-primary">Create Listing</button>
        </form>
      </div>
    </div>
  );
}

export default CreateListing;