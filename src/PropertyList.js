import React, { useState, useEffect } from 'react';

const PropertyList = ({ propertiesArr }) => {
    const [nftDataList, setNftDataList] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(null);

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

    const handleMouseEnter = (index) => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    const handleClick = () => {
        window.location.href = '/sign';
    };
    

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
            {propertiesArr.map((property, index) => (
                <div className="grid-item" key={index} style={{ position: 'relative' }}>
                    {nftDataList[index] && (
                        <div style={{ position: 'relative' }}>
                            <button onClick={handleClick} style={{ border: 'none', padding: 0, background: 'none', cursor: 'pointer' }}>
                                <img
                                    src={nftDataList[index].images[0]}
                                    alt="Property"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={handleMouseLeave}
                                />
                                {hoveredIndex === index && (
                                    <div style={{ position: 'absolute', top: 0, left: 0, padding: '10px', background: 'rgba(255, 255, 255, 0.7)', color: '#000' }}>
                                        <p>Token ID: {property.tokenId.toString()}</p>
                                        <p>Owner: {property.owner.toString()}</p>
                                        <p>Status: {property.state.toString()}</p>
                                        <p>Lease Price: {property.rentalPrice.toString()}</p>
                                        <p>Deposit: {property.depositAmount.toString()}</p>
                                        <p>Duration: {property.leaseDuration.toString()}</p>
                                        <p>Tenant Address: {property.tenant}</p>
                                    </div>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default PropertyList;




