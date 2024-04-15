// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importing the ERC721 interface to interact with NFTs
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
// Importing the residential lease agreement contract
import "./ResidentialLeaseAgreement.sol";
import "./PropertyRegistryNFT.sol";

// The factory contract that creates and tracks lease agreements
contract LeaseAgreementFactory {
    // The NFT registry interface, used to check ownership of properties
    IERC721 public propertyRegistry;

    //Define lease states
    enum LeaseState {Pending, Active, Inactive}

    // A struct to hold detailed information about each property listing
    struct PropertyListing {
        uint256 tokenId;            // The NFT token ID of the property
        address leaseContract;      // Address of the deployed lease contract for this property
        address owner;              // Owner of the property
        LeaseState state;           // Current state of the lease
    }

    // An array to store all property listings made through this factory
    PropertyListing[] public allProperties;

    // Event emitted when a new lease contract is created
    event LeaseCreated(address indexed leaseAddress, uint256 indexed tokenId, address indexed owner, bool isCurrentlyLeased);
    event LeaseActivated(address indexed leaseAddress, address indexed tenant, uint256 indexed tokenId, bool isCurrentlyLeased);
    event RentPaid(address indexed leaseAddress, uint256 amount, uint256 timestamp);
    event LeaseStateChanged(address indexed leaseAddress, uint256 indexed tokenId, LeaseState newState);

    // Constructor to set the property registry address
    constructor(address _propertyRegistry) {
        propertyRegistry = IERC721(_propertyRegistry);
    }

    mapping(uint256 => uint256) public tokenIdToIndex;

    /**
     * @dev Creates a new lease contract for a specified property.
     * @param tokenId Token ID of the property to lease.
     * @param rentalPrice Rental price per payment period.
     * @param depositAmount Amount of deposit required to secure the lease.
     * @param leaseDuration Duration of the lease in periods.
     * @return The address of the newly created lease contract.
     */
    function createLeaseContract(uint256 tokenId, uint256 rentalPrice, uint256 depositAmount, uint256 leaseDuration) public returns (address) {
        // Verify that the caller is the owner of the property NFT
        address owner = propertyRegistry.ownerOf(tokenId);
        require(msg.sender == owner, "Caller is not the owner of the NFT");
        
        // Create a new lease agreement contract
        ResidentialLeaseAgreement newLease = new ResidentialLeaseAgreement(tokenId, rentalPrice, depositAmount, leaseDuration, payable(owner));
        // Add the new lease to the array of all properties
        allProperties.push(PropertyListing(tokenId, address(newLease), owner, LeaseState.Pending));
        // Map the tokenId to the index for quick lookup
        uint256 index = allProperties.length - 1;
        tokenIdToIndex[tokenId] = index;
        // Emit an event for the creation of the lease
        emit LeaseCreated(address(newLease), tokenId, owner, false);
        
        // Return the address of the new lease contract
        return address(newLease);
    }

    /**
     * @dev Activates a lease by setting a tenant and transferring the required deposit.
     * @param tokenId Token ID of the property whose lease is to be activated.
     * @param tenant Address of the tenant who will occupy the property.
     */
    function activateLease(uint256 tokenId, address tenant) public payable {
        uint256 index = tokenIdToIndex[tokenId];
        PropertyListing storage listing = allProperties[index];
        require(msg.value == ResidentialLeaseAgreement(listing.leaseContract).depositAmount(), "Incorrect deposit amount");
        require(listing.state == LeaseState.Pending, "Lease cannot be activated from its current state");
        payable(listing.owner).transfer(msg.value);  // Transfer the deposit to the property owner directly
        ResidentialLeaseAgreement(listing.leaseContract).setTenant(tenant);
        listing.state = LeaseState.Active;

        emit LeaseActivated(listing.leaseContract, tenant, listing.tokenId, true);
    }

    /**
     * @dev Allows a tenant to make a rental payment for an active lease.
     * @param tokenId Token ID of the property for which rent is being paid.
     */
    function payRent(uint256 tokenId) public payable {
        uint256 index = tokenIdToIndex[tokenId];
        PropertyListing storage listing = allProperties[index];
        require(listing.state == LeaseState.Active, "Lease is not active");
        require(msg.value == ResidentialLeaseAgreement(listing.leaseContract).rentalPrice(), "Incorrect rent amount");

        payable(listing.owner).transfer(msg.value);
        emit RentPaid(listing.leaseContract, msg.value, block.timestamp);
    }


    /**
     * @dev Lists all properties registered within the factory.
     * @return An array of all registered property listings.
     */
    function listAllProperties() public view returns (PropertyListing[] memory) {
        return allProperties;
    }

    /**
     * @dev Updates the state of a lease agreement.
     * @param tokenId Token ID of the property whose lease state is to be updated.
     * @param newState New state to set for the lease (Pending, Active, Inactive).
     */
    function updateLeaseStatus(uint256 tokenId, LeaseState newState) public {
        uint256 index = tokenIdToIndex[tokenId];
        // Ensure that only the property owner can update the lease status
        require(msg.sender == propertyRegistry.ownerOf(allProperties[index].tokenId), "Unauthorized");
        // Ensure that only the pending contract can be deactivated 
        require(allProperties[index].state == LeaseState.Pending, "Only the pending contract can be deactivated");
        // Update the lease status in the array
        allProperties[index].state = newState;
        // Emit an event indicating the status update
        emit LeaseStateChanged(allProperties[index].leaseContract, allProperties[index].tokenId, newState);
    }
}
