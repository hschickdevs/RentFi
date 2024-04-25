import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Web3 from 'web3';
import "./PropertyList.css";


const PropertyList = ({ propertiesArr }) => {
    const [nftDataList, setNftDataList] = useState([]);
    let navigate = useNavigate();
    const location = useLocation();
    const loginState = location.state;

    useEffect(() => {
        const fetchNftDataList = async () => {
            const dataList = [];
            for (const property of propertiesArr) {
                try {
                    console.log(property);
                    const response = await fetch(property.NftUri);
                    const data = await response.json();
                    dataList.push(data);
                } catch (error) {
                    console.error('Error fetching NFT data:', error);
                    dataList.push({});
                }
            }
            // console.log(dataList);
            setNftDataList(dataList);
        };

        if (propertiesArr.length > 0) {
            fetchNftDataList();
        }
    }, [propertiesArr]);

    return (
        <>
            {/* Check if the login success state exists and render the message */}
            {loginState && loginState.loginSuccess && (
                <div className="alert alert-success" role="alert" style={{ textAlign: 'center' }}>
                    {loginState.loginSuccessMessage}
                </div>
            )}

            {
                propertiesArr.length > 0 && (<h1>Lease Marketplace</h1>)
            }
            <div className="property-grid">
                {propertiesArr.map((property, index) => (
                    <div key={index} className="property-card">
                        {nftDataList[index] && nftDataList[index].images ? (
                            <div className="property-details">
                                <img
                                    src={nftDataList[index].images[0]}
                                    alt={nftDataList[index].name || 'Property'}
                                    className="property-image"
                                />
                                <h4 className="property-heading">{nftDataList[index].name}</h4>
                                <p className="property-info">Rental Price: {Web3.utils.fromWei(property.rentalPrice.toString(), 'ether')} RENT</p>
                                <p className="property-info">Signing Deposit: {Web3.utils.fromWei(property.depositAmount.toString(), 'ether')} RENT</p>
                                <p className="property-info">Lease Duration: {property.leaseDuration.toString()} Months</p>
                            </div>
                        ) : (
                            <div className="property-image-placeholder">
                                <span>Loading...</span>
                            </div>
                        )}
                        <div className="property-button-div">
                            <button
                                onClick={() => navigate(`/properties/${property.tokenId}`, {
                                    state: { property: property, nftData: nftDataList[index] }
                                })}
                                className="property-button"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>


        </>
    );
};

export default PropertyList;