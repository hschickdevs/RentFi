import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import MetaMask from './MetaMask';
import CreateListing from './createListing';
import Ledger from './ledger';
import Sign from './sign';

function App() {
  // Function to handle the button click event and redirect to MetaMask component
  const handleLogin = () => {
    window.location.href = '/metamask'; // Directly changing the URL
  };

  // Function to handle the button click event and redirect to createListing page
  const handleCreateListing = () => {
    window.location.href = '/createListing'; // Directly changing the URL
  };

  const handleSign = () => {
    window.location.href = '/sign'; // Directly changing the URL
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleCreateListing}>Create Listing</button>
      <button onClick={handleSign}>Properties</button>
      <h1>3x3 Grid Example</h1>
      {/* TODO Add function call to listAllProperties */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridGap: '600px', margin: '20px' }}>
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
    </div>
  );
}

function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/metamask" element={<MetaMask />} />
        <Route path="/createListing" element={<CreateListing />} />
        <Route path="/" element={<App />} />
        <Route path="/ledger" element={<Ledger />} />
        <Route path="/sign" element={<Sign />} />
      </Routes>
    </Router>
  );
}

export default Main;
