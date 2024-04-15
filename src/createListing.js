import React, { useState } from 'react';

function CreateListing() {
  const [formData, setFormData] = useState({
    tokenId: '',
    rentalPrice: '',
    depositAmount: '',
    leaseDuration: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here, you can access formData object
    console.log(formData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Token ID:
          <input
            type="number"
            name="tokenId"
            value={formData.tokenId}
            onChange={handleChange}
          />
        </label>
        <label>
          Rental Price:
          <input
            type="number"
            name="rentalPrice"
            value={formData.rentalPrice}
            onChange={handleChange}
          />
        </label>
        <label>
          Deposit Amount:
          <input
            type="number"
            name="depositAmount"
            value={formData.depositAmount}
            onChange={handleChange}
          />
        </label>
        <label>
          Lease Duration:
          <input
            type="number"
            name="leaseDuration"
            value={formData.leaseDuration}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CreateListing;
