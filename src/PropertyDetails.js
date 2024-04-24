import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Web3 from 'web3';
import { LEASEAGREEMENTFACTORY_ADDRESS, LEASEAGREEMENTFACTORY_ABI } from './contracts/LeaseAgreementFactory.js';

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

  const handleSign = async () => {
    // Assuming 'window.ethereum' is available in the global scope.
    let provider = window.ethereum;

    try {
        // Request account access if needed
        await provider.request({ method: 'eth_requestAccounts' });

        // Create an instance of Web3 using the provider
        const web3 = new Web3(provider);

        // ----- TEMPORARY ----- Define the inputs for the smart contract function.
        const tokenId = 7; // Example tokenId
        const rentalPrice = web3.utils.toWei('1', 'ether'); // Example rental price in ether
        const depositAmount = web3.utils.toWei('0.1', 'ether'); // Example deposit in ether
        const leaseDuration = 12; // Lease duration in months, example value

        // Create a new contract instance with the provided ABI and address
        const contract = new web3.eth.Contract(LEASEAGREEMENTFACTORY_ABI, LEASEAGREEMENTFACTORY_ADDRESS);

        // Get accounts from the provider
        const accounts = await web3.eth.getAccounts();

        // Check if we have accounts available
        if (accounts.length === 0) {
            throw new Error("No accounts available. Please connect to MetaMask.");
        }

        // Call the smart contract method with the provided parameters and send a transaction
        const result = await contract.methods.activateLease(tokenId).send({ 
                                                                      from: accounts[0],
                                                                      gas: '1000000',
                                                                      gasPrice: 1000000000
                                                                    }); // Using the first account to send the transaction

        // Log the transaction receipt to console
        console.log('Transaction receipt:', result);

        // Optionally navigate back to the home page or another appropriate page
    } catch (error) {
        // Log any errors that occur during the process
        console.error('Error creating lease contract:', error);
    }
    // TODO add function call to updateLeaseStatus from factory lease agreement
    // TODO add function call to activateLease
    // TODO add function call to take money from renter
    window.location.href = '/ledger'; // Directly changing the URL
  };

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
          <p>Token ID: {property?.tokenId.toString()}</p>
          <p>Owner: {property?.owner}</p>
          <p>Status: {property?.state.toString()}</p>
          <p>Lease Price: {property?.rentalPrice.toString()}</p>
          <p>Deposit: {property?.depositAmount.toString()}</p>
          <p>Duration: {property?.leaseDuration.toString()}</p>
          <p>Tenant Address: {property?.tenant}</p>
          <button>Approve=</button>
          <button onClick={handleSign}>Sign Lease</button>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
