import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

function CreateListing() {
    const handleCreateListing = () => {
        window.location.href = '/ledger'; // Directly changing the URL
      };
    return (
        <div>
        <button onClick={handleCreateListing}>Ledger</button>
        </div>
  );
}

export default CreateListing;
