import React, { useState } from 'react';


const MetaMask = () => {
   const [errorMessage, setErrorMessage] = useState(null);
   const [defaultAccount, setDefaultAccount] = useState(null);
   const [isWalletConnected, setIsWalletConnected] = useState(false);


   const connectWalletHandler = () => {
       let provider;
       // First, we look for MetaMask-specific provider
       if (window.ethereum && window.ethereum.providers) {
           provider = window.ethereum.providers.find(p => p.isMetaMask);
       }


       // If no specific provider, fall back to the general ethereum provider
       if (!provider && window.ethereum && window.ethereum.isMetaMask) {
           provider = window.ethereum;
       }


       // Now, use the provider to request accounts
       if (provider) {
           provider.request({ method: 'eth_requestAccounts' })
               .then(result => {
                   accountChangedHandler(result[0]);
                   setIsWalletConnected(true); // Set the connected state to true
               })
               .catch(error => {
                   setErrorMessage('Something went wrong with accessing the MetaMask account.');
               });
       } else {
           setErrorMessage('MetaMask is not installed. Please install MetaMask to use this app.');
       }
   };


   const accountChangedHandler = (newAccount) => {
       setDefaultAccount(newAccount);
   };


   return (
       <div>
           <Navbar />
           <div className="container mt-3 text-center" style={{ marginTop: '50px' }}>
               {!isWalletConnected && ( // Only show this block if the wallet is not connected
                   <>
                       <h2>Connect your MetaMask wallet.</h2>
                       <div className="d-flex justify-content-center">
                           <button onClick={connectWalletHandler} className="btn btn-primary">Connect</button>
                       </div>
                   </>
               )}
               {isWalletConnected && defaultAccount && (
                   <h3 style={{ fontSize: 'smaller' }}>Your Account {defaultAccount} is successfully connected.</h3>
               )}
               {errorMessage && <p>{errorMessage}</p>}
           </div>
       </div>
   );
};


export default MetaMask;