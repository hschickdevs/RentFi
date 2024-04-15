import React, {useState} from 'react';
import {ethers} from 'ethers';


const MetaMask = () => {

    const [errorMessage, setErrorMessage] = useState(null);
    const [defaulAccount, setDefaultAccount] = useState(null);
    const [userBalance, setUserBalance] = useState(null);

    const connectWallet = () => {
        if (window.ethereum) {
            window.ethereum.request({method: 'eth_requestAccounts'})
            .then(result => {
                accountChanged([result[0]])
            })
        } else {
            setErrorMessage('Install MetaMask please!!')
        }
    }

    const accountChanged = (accountName) => {
        setDefaultAccount(accountName);
        getUserBalance(accountName)
    }

    const getUserBalance = (accountAddress) => {
        window.ethereum.request({method: 'eth_getBalance', params: [String(accountAddress), "latest"]})
        .then(balance => {
            setUserBalance(ethers.formatUnits(balance));
        })
    }

    return (
        <div>

        <h1>Metamask Wallet Connection</h1>

        <button onClick={connectWallet}>Connect Wallet Button</button>
        <h3>Address: {defaulAccount}</h3>
        <h3>Balance: MIS {userBalance}</h3>

        {errorMessage}
        </div>
    )
    
}

export default MetaMask;