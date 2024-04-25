import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import { LEASEAGREEMENTFACTORY_ADDRESS, LEASEAGREEMENTFACTORY_ABI } from './contracts/LeaseAgreementFactory.js';


function CreateListing() {
  const navigate = useNavigate();

  // State hooks to store form field values
  const [tokenId, setTokenId] = useState('');
  const [rentalPrice, setRentalPrice] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [leaseDuration, setLeaseDuration] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Assuming 'window.ethereum' is available in the global scope.
    let provider = window.ethereum;

    try {
      // Request account access if needed
      await provider.request({ method: 'eth_requestAccounts' });

      // Create an instance of Web3 using the provider
      const web3 = new Web3(provider);

      const listingData = {
        tokenId: parseInt(tokenId),
        rentalPrice: web3.utils.toWei(parseFloat(rentalPrice), 'ether'),
        depositAmount: web3.utils.toWei(parseFloat(depositAmount), 'ether'),
        leaseDuration: parseInt(leaseDuration),
      };

      // Create a new contract instance with the provided ABI and address
      const contract = new web3.eth.Contract(LEASEAGREEMENTFACTORY_ABI, LEASEAGREEMENTFACTORY_ADDRESS);

      // Get accounts from the provider
      const accounts = await web3.eth.getAccounts();

      // Check if we have accounts available
      if (accounts.length === 0) {
        throw new Error("No accounts available. Please connect to MetaMask.");
      }

      console.log('Creating lease contract with the following data:', listingData)

      // Call the smart contract method with the provided parameters and send a transaction
      const result = await contract.methods.createLeaseContract(
        listingData.tokenId,
        listingData.rentalPrice,
        listingData.depositAmount,
        listingData.leaseDuration).send({
          from: accounts[0],
          gas: '1000000',
          gasPrice: 1000000000
        }); // Using the first account to send the transaction

      // Log the transaction receipt to console
      console.log('Transaction receipt:', result);

      // Optionally navigate back to the home page or another appropriate page
      navigate(`/properties`);
    } catch (error) {
      // Log any errors that occur during the process
      console.error('Error creating lease contract:', error);
    }
  };

  return (
    <div>
      <div className="container mt-3">
        <h1>Create Listing</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="tokenId" className="form-label">Token ID</label>
            <input
              type="number"
              className="form-control"
              id="tokenId"
              placeholder="0"
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
              placeholder="0"
              required
              value={rentalPrice}
              onChange={(e) => setRentalPrice(e.target.value)}
            />
            <div className="form-text">Enter monthly rental price (in RENT token)</div>
          </div>
          <div className="mb-3">
            <label htmlFor="depositAmount" className="form-label">Deposit Amount</label>
            <input
              type="number"
              className="form-control"
              id="depositAmount"
              placeholder="0"
              required
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <div className="form-text">Specify the deposit required to secure the lease (in RENT token)</div>
          </div>
          <div className="mb-3">
            <label htmlFor="leaseDuration" className="form-label">Lease Duration</label>
            <input
              type="number"
              className="form-control"
              id="leaseDuration"
              placeholder="0"
              required
              value={leaseDuration}
              onChange={(e) => setLeaseDuration(e.target.value)}
            />
            <div className="form-text">Specify the duration of the lease (in months).</div>
          </div>
          <button type="submit" className="btn btn-primary connect-btn">Create Listing</button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
