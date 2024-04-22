// PropertyList.js
import React, { useState, useEffect } from 'react';

const PropertyList = ({ propertiesArr }) => {
    const [nftDataList, setNftDataList] = useState([]);

    useEffect(() => {
        const fetchNftDataList = async () => {
            const dataList = [];
            for (const property of propertiesArr) {
                try {
                    const response = await fetch(property.NftUri);
                    const data = await response.json();
                    dataList.push(data);
                } catch (error) {
                    console.error('Error fetching NFT data:', error);
                    dataList.push(null);
                }
            }
            setNftDataList(dataList);
        };

        if (propertiesArr.length > 0) {
            fetchNftDataList();
        }
    }, [propertiesArr]);

    return (
        <div className="grid-container">
            {propertiesArr.map((property, index) => (
                <div className="grid-item" key={index}>
                    <p>Token ID: {property.tokenId.toString()}</p>
                    <p>Owner: {property.owner.toString()}</p>
                    <p>Status: {property.state.toString()}</p>
                    <p>Lease Price: {property.rentalPrice.toString()}</p>
                    <p>Deposit: {property.depositAmount.toString()}</p>
                    <p>Duration: {property.leaseDuration.toString()}</p>
                    <p>Tenant Address: {property.tenant}</p>
                    {nftDataList[index] && (
                        <div>
                            <p>NFT Name: {nftDataList[index].name}</p>
                            <p>NFT Description: {nftDataList[index].description}</p>
                            {/* Add more details as needed */}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default PropertyList;
