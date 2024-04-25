// Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


const Navbar = () => {
 return (
   <nav className="navbar navbar-expand-lg navbar-light bg-light">
     <div className="container-fluid">
       <NavLink className="navbar-brand" to="/properties" id="left-logo">
         <img src="/logo.svg" alt="Left Logo" height="40" />
       </NavLink>
       <NavLink className="navbar-brand mx-auto" to="/properties" id="center-logo">
         <img src="/text-logo.png" alt="Central Logo" height="38" />
       </NavLink>
       <div className="navbar-nav ml-auto">
        <NavLink className="nav-item nav-link" to="/properties">Marketplace</NavLink>
        <NavLink className="nav-item nav-link" to="/createListing">Create Listing</NavLink>
        <NavLink className="nav-item nav-link" to="/ledger">My Ledger</NavLink>
       </div>
     </div>
   </nav>
 );
};


export default Navbar;