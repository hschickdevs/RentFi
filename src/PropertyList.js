import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


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
                    const response = await fetch(property.NftUri);
                    const data = await response.json();
                    dataList.push(data);
                } catch (error) {
                    console.error('Error fetching NFT data:', error);
                    dataList.push({});
                }
            }
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', justifyContent: 'center', alignItems: 'start' }}>
                {propertiesArr.map((property, index) => (
                    <div key={index} className="card" style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', transition: '0.3s' }}>
                        {nftDataList[index] && nftDataList[index].images ? (
                            <img
                                src={nftDataList[index].images[0]}
                                alt={nftDataList[index].name || 'Property'}
                                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                            />
                        ) : (
                            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
                                <span>Loading...</span>
                            </div>
                        )}
                        <div style={{ padding: '20px', textAlign: 'center', backgroundColor: 'white' }}>
                            <h4 style={{ margin: '0 0 10px 0' }}>{property.name}</h4>
                            <button
                                onClick={() => navigate(`/properties/${property.tokenId}`, { state: { property: property, nftData: nftDataList[index] } })}
                                style={{ border: 'none', outline: 'none', padding: '10px', color: 'white', backgroundColor: '#00B4D8', borderRadius: '10px', cursor: 'pointer', width: '100%' }}
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