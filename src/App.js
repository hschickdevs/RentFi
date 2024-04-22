import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import CreateListing from './createListing';
import Ledger from './ledger';
import Sign from './sign';
import Navbar from './Navbar';

function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const connectWalletHandler = () => {
    let provider;
    if (window.ethereum && window.ethereum.providers) {
      provider = window.ethereum.providers.find(p => p.isMetaMask);
    }
    if (!provider && window.ethereum && window.ethereum.isMetaMask) {
      provider = window.ethereum;
    }
    if (provider) {
      provider.request({ method: 'eth_requestAccounts' })
        .then(result => {
          setDefaultAccount(result[0]);
          setIsWalletConnected(true);
        })
        .catch(error => {
          setErrorMessage('Something went wrong with accessing the MetaMask account.');
        });
    } else {
      setErrorMessage('MetaMask is not installed. Please install MetaMask to use this app.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-3 text-center" style={{ marginTop: '50px' }}>
        {!isWalletConnected && (
          <>
            <h2>Connect your MetaMask wallet.</h2>
            <div className="d-flex justify-content-center">
              <button onClick={connectWalletHandler} className="btn btn-primary">Connect</button>
            </div>
          </>
        )}
        {isWalletConnected && defaultAccount && (
          <h3 style={{ fontSize: 'smaller' }}>Your account {defaultAccount} is successfully connected.</h3>
        )}
        {errorMessage && <p>{errorMessage}</p>}
      </div>
      <h2>Listings</h2>
     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
       <div className="grid-item">1</div>
       <div className="grid-item">2</div>
       <div className="grid-item">3</div>
       <div className="grid-item">4</div>
       <div className="grid-item">5</div>
       <div className="grid-item">6</div>
       <div className="grid-item">7</div>
       <div className="grid-item">8</div>
       <div className="grid-item">9</div>
     </div>
     </div>
  );
}

function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/createListing" element={<CreateListing />} />
        <Route path="/" element={<App />} />
        <Route path="/ledger" element={<Ledger />} />
        <Route path="/sign" element={<Sign />} />
      </Routes>
    </Router>
  );
}

export default Main;