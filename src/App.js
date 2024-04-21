import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MetaMask from './MetaMask';
import CreateListing from './createListing';
import Ledger from './ledger';
import Sign from './sign';
import Navbar from './Navbar';


function App() {
 return (
   <div>
     <Navbar />
     <h2>Available Listings</h2>
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
