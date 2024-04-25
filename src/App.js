import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import CreateListing from './createListing';
import Ledger from './ledger';
import Sign from './sign';
import Navbar from './Navbar';
import Web3 from 'web3';
import PropertyList from './PropertyList';
import PropertyDetails from './PropertyDetails';
import { LEASEAGREEMENTFACTORY_ADDRESS, LEASEAGREEMENTFACTORY_ABI } from './contracts/LeaseAgreementFactory.js';

function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [web3Instance, setWeb3Instance] = useState(null);
  const [properties, setProperties] = useState([]);

  const navigate = useNavigate(); // Hook to programmatically navigate

  const fetchData = async (web3) => {
    const contract = new web3.eth.Contract(LEASEAGREEMENTFACTORY_ABI, LEASEAGREEMENTFACTORY_ADDRESS);
    try {
      const result = await contract.methods.listAllPropertiesDetailed().call();
      setProperties(result);
    } catch (error) {
      console.error('Error retrieving properties:', error);
    }
  };

  const connectWalletHandler = async () => {
    let provider = window.ethereum;
    if (provider) {
      try {
        await provider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(provider);
        setWeb3Instance(web3);
        setIsWalletConnected(true);
        await fetchData(web3); // Fetch data after connecting
        const loginSuccessMessage = 'Your account has successfully been logged in.';
        navigate('/properties', { state: { loginSuccess: true, loginSuccessMessage: loginSuccessMessage } });
      } catch (error) {
        setErrorMessage('Error connecting to MetaMask: ' + error.message);
      }
    } else {
      setErrorMessage('MetaMask is not installed. Please install MetaMask to use this app.');
    }
  };

  return (
        <>
          <Navbar />
          <div className="container mt-3 text-center">
            {!isWalletConnected && (
              <>
                <h1>Please connect your MetaMask wallet.</h1>
                <button onClick={connectWalletHandler} className="btn btn-primary connect-btn">Connect</button>
                {errorMessage && <p>{errorMessage}</p>}
              </>
            )}
          </div>
          <Routes>
            <Route path="/createListing" element={<CreateListing />} />
            <Route path="/ledger" element={<Ledger />} />
            <Route path="/sign" element={<Sign />} />
            <Route path="/properties" element={<PropertyList propertiesArr={properties} />} />
            <Route path="/properties/:tokenId" element={<PropertyDetails />} />
          </Routes>
        </>
      );
    }
    
    export default App;
