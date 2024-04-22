import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Navbar from './Navbar';

const MetaMask = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [userBalance, setUserBalance] = useState(null);

    useEffect(() => {
        if (defaultAccount) {
            getUserBalance(defaultAccount);
        }
    }, [defaultAccount]);

    const connectWalletHandler = () => {
        if (window.ethereum && window.ethereum.isMetaMask) {
            window.ethereum.request({ method: 'eth_requestAccounts' })
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

    const getUserBalance = (accountAddress) => {
        window.ethereum.request({ method: 'eth_getBalance', params: [String(accountAddress), "latest"] })
            .then(balance => {
                setUserBalance(ethers.formatUnits(balance));
            })
            .catch(error => {
                setErrorMessage(error.message);
            });
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
                    <h3 style={{ fontSize: 'smaller' }}>Your Account {defaultAccount} is successfully connected. Your balance is {userBalance} MIS</h3>
                )}
                {errorMessage && <p>{errorMessage}</p>}
            </div>
        </div>
    );
};

export default MetaMask;
