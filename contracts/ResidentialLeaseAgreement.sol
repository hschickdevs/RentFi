// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// This contract models a typical residential lease agreement for blockchain implementation.
// It handles the essential details such as rental price, deposit amount, lease duration, 
// and tenant information specific to residential properties.
contract ResidentialLeaseAgreement {
    // Unique identifier for the property as a token on the blockchain.
    uint256 public tokenId;
    // The amount to be paid monthly by the tenant.
    uint256 public rentalPrice;       
    // Security deposit required at the start of the lease to cover potential damages or unpaid rent.
    uint256 public depositAmount;     
    // Total duration of the lease agreement in months.
    uint256 public leaseDuration;     
    // Ethereum address of the tenant, initially unset until the lease is activated.
    address public tenant;            
    // Ethereum address of the property owner who is leasing out the property.
    address payable public owner;     

    // Events that notify watchers of the blockchain about significant actions and state changes within the contract.
    event TenantSet(address tenant);  // Fired when a new tenant is associated with the lease.

    // Constructor to set up the initial state of the lease contract.
    // Parameters include unique identifiers and financial terms of the lease.
    constructor(uint256 _tokenId, uint256 _rentalPrice, uint256 _depositAmount, uint256 _leaseDuration, address payable _owner) {
        tokenId = _tokenId;  // Unique ID of the property, often linked to an NFT.
        rentalPrice = _rentalPrice;  // Monthly rent amount expected from the tenant.
        depositAmount = _depositAmount;  // Initial security deposit required to secure the lease.
        leaseDuration = _leaseDuration;  // Length of the lease term in months.
        owner = _owner;  // Owner of the property, who receives the rent and deposit payments.
    }

    // Sets the tenant for the lease. This function is typically called by the lease agreement factory to initialize a new tenant.
    // Input: _tenant - Address of the new tenant.
    function setTenant(address _tenant) external {
        tenant = _tenant;  // Set the tenant's address to activate the lease.
    }

    // Uncomment this section to enable lease termination functionality:
    // Terminates the lease agreement. This function can be initiated by either the tenant or the owner.
    // It checks that the caller is authorized (either the tenant or the owner) and then deactivates the lease.
    /*
    function terminateLease() external {
        require(msg.sender == owner || msg.sender == tenant, "Unauthorized to terminate");  // Ensure that only authorized parties can terminate the lease.
        isActive = false;  // Set the lease status to inactive.
        emit LeaseTerminated(msg.sender);  // Emit an event for logging the termination.
    }
    */
}
