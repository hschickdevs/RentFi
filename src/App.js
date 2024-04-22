import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import CreateListing from './createListing';
import Ledger from './ledger';
import Sign from './sign';
import Navbar from './Navbar';
import Web3 from 'web3';
import PropertyList from './PropertyList';

function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [web3Instance, setWeb3Instance] = useState(null);
  const [properties, setProperties] = useState([]);
  
  // Contract ABI and address
  // Contract ABI and address
  const contractABI = [  {
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
  const contractAddress = '0x11D1454A00095c398b88F1A93DD2B0c9A560E62A'; // Contract address from version 2

  useEffect(() => {
    fetchData();
    initializeWeb3();
  }, []);

  const initializeWeb3 = async () => {
    if (window.ethereum) {
      try {
        if (window.ethereum.request) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
        } else {
          await window.ethereum.send('eth_requestAccounts');
        }
        const web3 = new Web3(window.ethereum);
        setWeb3Instance(web3);
      } catch (error) {
        console.error('Error initializing web3:', error);
        // Handle error gracefully
      }
    } else {
      console.error('No Ethereum provider detected');
    }
  };

  const fetchData = async () => {
    if (web3Instance) {
      const contract = new web3Instance.eth.Contract(contractABI, contractAddress);
      try {
        const result = await contract.methods.listAllPropertiesDetailed().call();
        setProperties(result);
      } catch (error) {
        console.error('Error retrieving properties:', error);
      }
    } else {
      console.error('Web3 is not initialized');
    }
  };

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

  const displayProperties = () => {
    return properties.map((property, index) => (
      <div className="grid-item" key={index}>
        <div>{property.tokenId}</div>
        <div>{property.NftUri}</div>
        <div>{property.leaseContract}</div>
        <div>{property.owner}</div>
        <div>{property.state}</div>
        {/* Add other property details here */}
      </div>
    ));
  };


  return (
    <Router>
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
      <Routes>
        <Route path="/createListing" element={<CreateListing />} />
        <Route path="/ledger" element={<Ledger />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/" element={<PropertyList propertiesArr={properties} />} />
      </Routes>
      <h2>Listings</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
        {displayProperties()}
      </div>
    </Router>
  );
}

export default App;
