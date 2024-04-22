// PropertyList.js
import React, { useState, useEffect } from 'react';

const PropertyList = ({ propertiesArr }) => {
    const [nftData, setNftData] = useState(null);

    useEffect(() => {
        if (propertiesArr.length > 0) {
            const nftUri = propertiesArr[0].NftUri;
            fetchNftData(nftUri);
        }
    }, [propertiesArr]);

    const fetchNftData = async (uri) => {
        try {
            const response = await fetch(uri);
            const data = await response.json();
            setNftData(data);
        } catch (error) {
            console.error('Error fetching NFT data:', error);
        }
    };

    if (propertiesArr.length > 0) {
        const propertiesObj = propertiesArr[0];
        return (
            <div>
                <div key={propertiesObj.tokenId}>
                    <p>Token ID: {propertiesObj.tokenId.toString()}</p>
                    <p>Owner: {propertiesObj.owner.toString()}</p>
                    <p>Status: {propertiesObj.state.toString()}</p>
                    <p>Lease Price: {propertiesObj.rentalPrice.toString()}</p>
                    <p>Deposit: {propertiesObj.depositAmount.toString()}</p>
                    <p>Duration: {propertiesObj.leaseDuration.toString()}</p>
                    <p>Tenant Address: {propertiesObj.tenant}</p>
                    {nftData && (
                        <div>
                            <p>NFT Name: {nftData.name}</p>
                            <p>NFT Description: {nftData.description}</p>
                            {/* Add more details as needed */}
                        </div>
                    )}
                </div>
            </div>
        );
    } else {
        return null; // or some default message if propertiesArr is empty
    }
};

export default PropertyList;
