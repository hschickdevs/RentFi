import React from 'react';

function Home({ properties }) {
  const displayProperties = () => {
    return properties.map((property, index) => (
      <div className="grid-item" key={index}>
        {/* ... your property display code */}
      </div>
    ));
  };

  return (
    <>
      <h2>All Listings</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
       <div className="grid-item">1</div>
       <div className="grid-item">2</div>
       <div className="grid-item">3</div>
       <div className="grid-item">4</div>
       <div className="grid-item">5</div>
       <div className="grid-item">6</div>
       <div className="grid-item">7</div>
       <div className="grid-item">8</div>
       <div className="grid-item">9</div>
      </div>
    </>
  );
}

export default Home;
