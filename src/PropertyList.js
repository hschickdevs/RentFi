import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', justifyContent: 'center', alignItems: 'start', padding: '20px' }}>
        {propertiesArr.map((property, index) => (
          <NavLink to={`/properties/${property.tokenId}`} key={index} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', transition: '0.3s' }}>
              {nftDataList[index] && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <img
                    src={nftDataList[index].images[0]}
                    alt="Property"
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '15px' }}>
                    <h4>{nftDataList[index].name}</h4>
                    <div style={{ color: 'grey' }}>{nftDataList[index].category}</div>
                    <div style={{ padding: '10px 0' }}>
                      {/* Display any other relevant information here */}
                    </div>
                    <button style={{ border: 'none', outline: 'none', padding: '10px', color: 'white', backgroundColor: '#00B4D8', borderRadius: '10px', cursor: 'pointer' }}>
                      View Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          </NavLink>
        ))}
      </div>
    );
};

export default PropertyList;


// import React, { useState, useEffect } from 'react';
// import { NavLink } from 'react-router-dom';

// const PropertyList = ({ propertiesArr }) => {
//     const [nftDataList, setNftDataList] = useState([]);
//     const [hoveredIndex, setHoveredIndex] = useState(null);

//     useEffect(() => {
//         const fetchNftDataList = async () => {
//             const dataList = [];
//             for (const property of propertiesArr) {
//                 try {
//                     const response = await fetch(property.NftUri);
//                     const data = await response.json();
//                     dataList.push(data);
//                 } catch (error) {
//                     console.error('Error fetching NFT data:', error);
//                     dataList.push(null);
//                 }
//             }
//             setNftDataList(dataList);
//         };

//         if (propertiesArr.length > 0) {
//             fetchNftDataList();
//         }
//     }, [propertiesArr]);

//     const handleMouseEnter = (index) => {
//         setHoveredIndex(index);
//     };

//     const handleMouseLeave = () => {
//         setHoveredIndex(null);
//     };

//     const handleClick = () => {
//         window.location.href = '/sign';
//     };
    

//     return (
//         <>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
//             {propertiesArr.map((property, index) => (
//               <NavLink to={`/properties/${property.tokenId}`} key={index} style={{ textDecoration: 'none' }}>
//                 <div className="grid-item" style={{ position: 'relative' }}>
//                   {nftDataList[index] && (
//                     <div style={{ position: 'relative' }}>
//                       <img
//                         src={nftDataList[index].images[0]}
//                         alt="Property"
//                         style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//                         onMouseEnter={() => handleMouseEnter(index)}
//                         onMouseLeave={handleMouseLeave}
//                       />
//                       {hoveredIndex === index && (
//                         <div style={{ position: 'absolute', top: 0, left: 0, padding: '10px', background: 'rgba(255, 255, 255, 0.7)', color: '#000' }}>
//                           <p>Token ID: {property.tokenId.toString()}</p>
//                           <p>Owner: {property.owner.toString()}</p>
//                           <p>Status: {property.state.toString()}</p>
//                           <p>Lease Price: {property.rentalPrice.toString()}</p>
//                           <p>Deposit: {property.depositAmount.toString()}</p>
//                           <p>Duration: {property.leaseDuration.toString()}</p>
//                           <p>Tenant Address: {property.tenant}</p>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </NavLink>
//             ))}
//           </div>
//         </>
//       );
//     };
    
//     export default PropertyList;