import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './ledger.css';
import Web3 from 'web3';
import { LEASEAGREEMENTFACTORY_ADDRESS, LEASEAGREEMENTFACTORY_ABI } from './contracts/LeaseAgreementFactory.js';

function Ledger() {
  const [ownedProperties, setOwnedProperties] = useState([]);
  const [rentedProperties, setRentedProperties] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  const LeaseStateDescriptions = {
    0: 'Pending',
    1: 'Active',
    2: 'Inactive',
    3: 'Deleted'
  };

  const fetchProperties = async (web3, accounts) => {
    const contract = new web3.eth.Contract(LEASEAGREEMENTFACTORY_ABI, LEASEAGREEMENTFACTORY_ADDRESS);
    const allProperties = await contract.methods.listAllPropertiesDetailed().call();
    const owned = [];
    const rented = [];

    for (let i = 0; i < allProperties.length; i++) {
      if (allProperties[i].owner.toString() === accounts[0].toString()) {
        owned.push(allProperties[i]);
      }
      if (allProperties[i].tenant.toString() === accounts[0].toString()) {
        rented.push(allProperties[i]);
      }
    }

    setOwnedProperties(owned);
    setRentedProperties(rented);
  };

  const deleteLease = async (tokenId) => {
    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(LEASEAGREEMENTFACTORY_ABI, LEASEAGREEMENTFACTORY_ADDRESS);

      await contract.methods.deleteLeaseContract(tokenId).send({
        from: accounts[0],
        gas: '1000000',
        gasPrice: 1000000000
      });
      alert('Lease deleted successfully!');
      fetchProperties(web3, accounts); // Refresh the properties list
    } catch (error) {
      console.error('Error deleting the lease:', error);
      alert('Failed to delete lease: ' + error.message);
    }
  };

  useEffect(() => {
    const initWeb3 = async () => {
      let provider = window.ethereum;
      if (provider) {
        try {
          await provider.request({ method: 'eth_requestAccounts' });
          const web3 = new Web3(provider);
          const accounts = await web3.eth.getAccounts();

          if (accounts.length > 0) {
            await fetchProperties(web3, accounts);
          }
        } catch (error) {
          console.error('Error accessing the Ethereum account:', error);
        }
      } else {
        console.error('MetaMask is not installed. Please install MetaMask to use this app.');
      }
    };

    initWeb3();
  }, []);

  return (
    <div className="my-rentals-page">
      <div className="header">
        <h1>My Rentals / My Leases</h1>
      </div>
      <div className="rentals-list">
        {ownedProperties.map((prop, index) => (
          <div className="rental-item" key={index}>
            <h2>Lease: {prop.leaseContract}</h2>
            <p><strong>Contract Status:</strong> {LeaseStateDescriptions[prop.state]}</p>
            <p><strong>Owner:</strong> {prop.owner}</p>
            <p><strong>Tenant:</strong> {prop.tenant}</p>
            <div style={{ marginTop: '10px' }}>
              <button className="property-btn" onClick={() => navigate(`/properties/${prop.tokenId}`, { state: { property: prop } })}>View Lease</button>
              {prop.state.toString() === "0" && (
                <button className="property-btn" onClick={() => deleteLease(prop.tokenId)}>Cancel Lease</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
);

}

export default Ledger;
