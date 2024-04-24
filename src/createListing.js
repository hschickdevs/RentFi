import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateListing() {
  const navigate = useNavigate();

  // State hooks to store form field values
  const [tokenId, setTokenId] = useState('');
  const [rentalPrice, setRentalPrice] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [leaseDuration, setLeaseDuration] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here, you would handle the form submission to the blockchain or server...
    const listingData = {
      tokenId: parseInt(tokenId),
      rentalPrice: parseInt(rentalPrice),
      depositAmount: parseInt(depositAmount),
      leaseDuration: parseInt(leaseDuration),
    };

    console.log(listingData); // For now, just log the collected data

    // TODO: Connect to blockchain and send 'listingData' to your smart contract

    // After successful submission:
    navigate('/properties');
  };

  return (
    <div>
      <div className="container mt-3">
        <h2>Create Listing</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="tokenId" className="form-label">Token ID</label>
            <input
              type="number"
              className="form-control"
              id="tokenId"
              placeholder="Enter token ID"
              required
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
            />
            <div className="form-text">Enter the token ID of the property to be leased that has not been listed.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="rentalPrice" className="form-label">Rental Price</label>
            <input
              type="number"
              className="form-control"
              id="rentalPrice"
              placeholder="Enter rental price per period"
              required
              value={rentalPrice}
              onChange={(e) => setRentalPrice(e.target.value)}
            />
            <div className="form-text">Set the rental price per payment period.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="depositAmount" className="form-label">Deposit Amount</label>
            <input
              type="number"
              className="form-control"
              id="depositAmount"
              placeholder="Enter deposit amount"
              required
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <div className="form-text">Specify the deposit required to secure the lease.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="leaseDuration" className="form-label">Lease Duration</label>
            <input
              type="number"
              className="form-control"
              id="leaseDuration"
              placeholder="Enter lease duration"
              required
              value={leaseDuration}
              onChange={(e) => setLeaseDuration(e.target.value)}
            />
            <div className="form-text">Define the duration of the lease in payment periods.</div>
          </div>
          <button type="submit" className="btn btn-primary">Submit Listing</button>
        </form>
      </div>
    </div>
  );
}

export default CreateListing;
