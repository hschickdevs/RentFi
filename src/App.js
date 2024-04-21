import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import MetaMask from './MetaMask';
import CreateListing from './createListing';
import Ledger from './ledger';
import Sign from './sign';
import Web3 from 'web3';


// Contract ABI and address
var contractABI = [
  {
              "inputs": [
                      {
                              "internalType": "uint256",
                              "name": "tokenId",
                              "type": "uint256"
                      }
              ],
              "name": "activateLease",
              "outputs": [],
              "stateMutability": "payable",
              "type": "function"
      },
      {
              "inputs": [
                      {
                              "internalType": "uint256",
                              "name": "tokenId",
                              "type": "uint256"
                      },
                      {
                              "internalType": "uint256",
                              "name": "rentalPrice",
                              "type": "uint256"
                      },
                      {
                              "internalType": "uint256",
                              "name": "depositAmount",
                              "type": "uint256"
                      },
                      {
                              "internalType": "uint256",
                              "name": "leaseDuration",
                              "type": "uint256"
                      }
              ],
              "name": "createLeaseContract",
              "outputs": [
                      {
                              "internalType": "address",
                              "name": "",
                              "type": "address"
                      }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
      },
      {
              "inputs": [
                      {
                              "internalType": "address",
                              "name": "_propertyRegistry",
                              "type": "address"
                      }
              ],
              "stateMutability": "nonpayable",
              "type": "constructor"
      },
      {
              "anonymous": false,
              "inputs": [
                      {
                              "indexed": true,
                              "internalType": "address",
                              "name": "leaseAddress",
                              "type": "address"
                      },
                      {
                              "indexed": true,
                              "internalType": "address",
                              "name": "tenant",
                              "type": "address"
                      },
                      {
                              "indexed": true,
                              "internalType": "uint256",
                              "name": "tokenId",
                              "type": "uint256"
                      },
                      {
                              "indexed": false,
                              "internalType": "bool",
                              "name": "isCurrentlyLeased",
                              "type": "bool"
                      }
              ],
              "name": "LeaseActivated",
              "type": "event"
      },
      {
              "anonymous": false,
              "inputs": [
                      {
                              "indexed": true,
                              "internalType": "address",
                              "name": "leaseAddress",
                              "type": "address"
                      },
                      {
                              "indexed": true,
                              "internalType": "uint256",
                              "name": "tokenId",
                              "type": "uint256"
                      },
                      {
                              "indexed": true,
                              "internalType": "address",
                              "name": "owner",
                              "type": "address"
                      },
                      {
                              "indexed": false,
                              "internalType": "bool",
                              "name": "isCurrentlyLeased",
                              "type": "bool"
                      }
              ],
              "name": "LeaseCreated",
              "type": "event"
      },
      {
              "anonymous": false,
              "inputs": [
                      {
                              "indexed": true,
                              "internalType": "address",
                              "name": "leaseAddress",
                              "type": "address"
                      },
                      {
                              "indexed": true,
                              "internalType": "uint256",
                              "name": "tokenId",
                              "type": "uint256"
                      },
                      {
                              "indexed": false,
                              "internalType": "enum LeaseAgreementFactory.LeaseState",
                              "name": "newState",
                              "type": "uint8"
                      }
              ],
              "name": "LeaseStateChanged",
              "type": "event"
      },
      {
              "inputs": [
                      {
                              "internalType": "uint256",
                              "name": "tokenId",
                              "type": "uint256"
                      }
              ],
              "name": "payRent",
              "outputs": [],
              "stateMutability": "payable",
              "type": "function"
      },
      {
              "anonymous": false,
              "inputs": [
                      {
                              "indexed": true,
                              "internalType": "address",
                              "name": "leaseAddress",
                              "type": "address"
                      },
                      {
                              "indexed": false,
                              "internalType": "uint256",
                              "name": "amount",
                              "type": "uint256"
                      },
                      {
                              "indexed": false,
                              "internalType": "uint256",
                              "name": "timestamp",
                              "type": "uint256"
                      }
              ],
              "name": "RentPaid",
              "type": "event"
      },
      {
              "inputs": [
                      {
                              "internalType": "uint256",
                              "name": "tokenId",
                              "type": "uint256"
                      },
                      {
                              "internalType": "enum LeaseAgreementFactory.LeaseState",
                              "name": "newState",
                              "type": "uint8"
                      }
              ],
              "name": "updateLeaseStatus",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
      },
      {
              "inputs": [
                      {
                              "internalType": "uint256",
                              "name": "",
                              "type": "uint256"
                      }
              ],
              "name": "allProperties",
              "outputs": [
                      {
                              "internalType": "uint256",
                              "name": "tokenId",
                              "type": "uint256"
                      },
                      {
                              "internalType": "address",
                              "name": "leaseContract",
                              "type": "address"
                      },
                      {
                              "internalType": "address",
                              "name": "owner",
                              "type": "address"
                      },
                      {
                              "internalType": "enum LeaseAgreementFactory.LeaseState",
                              "name": "state",
                              "type": "uint8"
                      }
              ],
              "stateMutability": "view",
              "type": "function"
      },
      {
              "inputs": [
                      {
                              "internalType": "uint256",
                              "name": "tokenId",
                              "type": "uint256"
                      }
              ],
              "name": "getLeaseInfo",
              "outputs": [
                      {
                              "internalType": "address",
                              "name": "leaseContract",
                              "type": "address"
                      },
                      {
                              "internalType": "address",
                              "name": "tenant",
                              "type": "address"
                      },
                      {
                              "internalType": "uint256",
                              "name": "rentalPrice",
                              "type": "uint256"
                      },
                      {
                              "internalType": "uint256",
                              "name": "depositAmount",
                              "type": "uint256"
                      },
                      {
                              "internalType": "uint256",
                              "name": "leaseDuration",
                              "type": "uint256"
                      },
                      {
                              "internalType": "enum LeaseAgreementFactory.LeaseState",
                              "name": "state",
                              "type": "uint8"
                      }
              ],
              "stateMutability": "view",
              "type": "function"
      },
      {
              "inputs": [
                      {
                              "internalType": "uint256",
                              "name": "tokenId",
                              "type": "uint256"
                      }
              ],
              "name": "getNFTowner",
              "outputs": [
                      {
                              "internalType": "address",
                              "name": "NFTowner",
                              "type": "address"
                      }
              ],
              "stateMutability": "view",
              "type": "function"
      },
      {
              "inputs": [],
              "name": "listAllProperties",
              "outputs": [
                      {
                              "components": [
                                      {
                                              "internalType": "uint256",
                                              "name": "tokenId",
                                              "type": "uint256"
                                      },
                                      {
                                              "internalType": "address",
                                              "name": "leaseContract",
                                              "type": "address"
                                      },
                                      {
                                              "internalType": "address",
                                              "name": "owner",
                                              "type": "address"
                                      },
                                      {
                                              "internalType": "enum LeaseAgreementFactory.LeaseState",
                                              "name": "state",
                                              "type": "uint8"
                                      }
                              ],
                              "internalType": "struct LeaseAgreementFactory.PropertyListing[]",
                              "name": "",
                              "type": "tuple[]"
                      }
              ],
              "stateMutability": "view",
              "type": "function"
      },
      {
              "inputs": [],
              "name": "listAllPropertiesDetailed",
              "outputs": [
                      {
                              "components": [
                                      {
                                              "internalType": "uint256",
                                              "name": "tokenId",
                                              "type": "uint256"
                                      },
                                      {
                                              "internalType": "string",
                                              "name": "NftUri",
                                              "type": "string"
                                      },
                                      {
                                              "internalType": "address",
                                              "name": "leaseContract",
                                              "type": "address"
                                      },
                                      {
                                              "internalType": "address",
                                              "name": "owner",
                                              "type": "address"
                                      },
                                      {
                                              "internalType": "enum LeaseAgreementFactory.LeaseState",
                                              "name": "state",
                                              "type": "uint8"
                                      },
                                      {
                                              "internalType": "address",
                                              "name": "tenant",
                                              "type": "address"
                                      },
                                      {
                                              "internalType": "uint256",
                                              "name": "rentalPrice",
                                              "type": "uint256"
                                      },
                                      {
                                              "internalType": "uint256",
                                              "name": "depositAmount",
                                              "type": "uint256"
                                      },
                                      {
                                              "internalType": "uint256",
                                              "name": "leaseDuration",
                                              "type": "uint256"
                                      }
                              ],
                              "internalType": "struct LeaseAgreementFactory.DetailedPropertyListing[]",
                              "name": "",
                              "type": "tuple[]"
                      }
              ],
              "stateMutability": "view",
              "type": "function"
      },
      {
              "inputs": [],
              "name": "propertyRegistry",
              "outputs": [
                      {
                              "internalType": "contract ERC721",
                              "name": "",
                              "type": "address"
                      }
              ],
              "stateMutability": "view",
              "type": "function"
      },
      {
              "inputs": [
                      {
                              "internalType": "uint256",
                              "name": "",
                              "type": "uint256"
                      }
              ],
              "name": "tokenIdToIndex",
              "outputs": [
                      {
                              "internalType": "uint256",
                              "name": "",
                              "type": "uint256"
                      }
              ],
              "stateMutability": "view",
              "type": "function"
      }
    // Your contract ABI here
  ];
var contractAddress = '0x11D1454A00095c398b88F1A93DD2B0c9A560E62A'; // Replace with your contract address

// Ethereum-enabled check
const ethEnabled = async () => {
  if (window.ethereum) {
    try {
      const web3 = new Web3(window.ethereum);
      return true;
    } catch (error) {
      console.error('Error requesting accounts:', error);
      return false;
    }
  } else {
    console.error('Ethereum provider not found.');
    alert("Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!");
    return false;
  }
}

// Function to retrieve all properties
async function listAllProperties() {
  if (!await ethEnabled()) return;

  try {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    contract.methods.listAllProperties().call((err, result) => {
      if (err) {
        console.error("Error:", err);
        return;
      }

      console.log("All Properties:", result);
      displayProperties(result);
    });
  } catch (error) {
    console.error("Error creating contract instance:", error);
  }
}


// Function to display properties
function displayProperties(properties) {
  var propertiesDiv = document.getElementById('properties');
  propertiesDiv.innerHTML = '';

  properties.forEach(property => {
      var propertyInfo = document.createElement('p');
      propertyInfo.textContent = `Token ID: ${property.tokenId}, Lease Contract: ${property.leaseContract}, Owner: ${property.owner}, State: ${property.state}`;
      propertiesDiv.appendChild(propertyInfo);
  });
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
      <button onClick={listAllProperties}>Ahlad</button>
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

export default Main;
