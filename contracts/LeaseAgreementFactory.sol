// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Importing the ERC721 to interact with NFTs
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Importing the local interfaces
import "./ResidentialLeaseAgreement.sol";
import "./RentFiToken.sol";

// The factory contract that creates and tracks lease agreements
contract LeaseAgreementFactory {
    // The NFT registry interface, used to check ownership of properties
    ERC721 public propertyRegistry;
    IERC20 public utilityToken;

    //Define lease states
    enum LeaseState {
        Pending,
        Active,
        Inactive,
        Deleted
    }

    // A struct to hold detailed information about each property listing
    struct PropertyListing {
        uint256 tokenId; // The NFT token ID of the property
        address leaseContract; // Address of the deployed lease contract for this property
        address owner; // Owner of the property
        LeaseState state; // Current state of the lease
    }

    // A struct for storing more detailed information about property listings
    struct DetailedPropertyListing {
        uint256 tokenId;
        string NftUri;
        address leaseContract;
        address owner;
        LeaseState state;
        address tenant;
        uint256 rentalPrice;
        uint256 depositAmount;
        uint256 leaseDuration;
    }

    // An array to store all property listings made through this factory
    PropertyListing[] public allProperties;
    mapping(uint256 => uint256) public tokenIdToIndex;

    // Event emitted when a new lease contract is created
    event LeaseCreated(
        address indexed leaseAddress,
        uint256 indexed tokenId,
        address indexed owner,
        bool isCurrentlyLeased
    );
    event LeaseActivated(
        address indexed leaseAddress,
        address indexed tenant,
        uint256 indexed tokenId,
        bool isCurrentlyLeased
    );
    event RentPaid(
        address indexed leaseAddress,
        uint256 amount,
        uint256 timestamp
    );
    event LeaseStateChanged(
        address indexed leaseAddress,
        uint256 indexed tokenId,
        LeaseState newState
    );

    // Constructor to set the property registry address
    constructor(address _propertyRegistry, address _utilityToken) {
        // propertyRegistry = IERC721(_propertyRegistry);
        utilityToken = IERC20(_utilityToken);
        propertyRegistry = ERC721(_propertyRegistry);
    }

    /**
     * @dev Creates a new lease contract for a specified property.
     * @param tokenId Token ID of the property to lease.
     * @param rentalPrice Rental price per payment period.
     * @param depositAmount Amount of deposit required to secure the lease.
     * @param leaseDuration Duration of the lease in periods.
     * @return The address of the newly created lease contract.
     */
    function createLeaseContract(
        uint256 tokenId,
        uint256 rentalPrice,
        uint256 depositAmount,
        uint256 leaseDuration
    ) public returns (address) {
        // Verify that the caller is the owner of the property NFT
        address owner = propertyRegistry.ownerOf(tokenId);
        require(msg.sender == owner, "Caller is not the owner of the NFT");

        // Check if a lease already exists for this tokenId
        require(
            tokenIdToIndex[tokenId] == 0 &&
                propertyRegistry.ownerOf(tokenId) != address(0),
            "Lease already exists for this tokenId or tokenId is invalid"
        );

        // Create a new lease agreement contract
        ResidentialLeaseAgreement newLease = new ResidentialLeaseAgreement(
            tokenId,
            rentalPrice,
            depositAmount,
            leaseDuration,
            payable(owner)
        );
        // Using length+1 to shift index to start from 1
        if (allProperties.length == 0) {
            // Initialize index 0 with dummy data if not already initialized
            allProperties.push(
                PropertyListing(0, address(0), address(0), LeaseState.Inactive)
            );
        }
        // Add the new lease to the array of all properties
        allProperties.push(
            PropertyListing(
                tokenId,
                address(newLease),
                owner,
                LeaseState.Pending
            )
        );
        // Map the tokenId to the index for quick lookup
        tokenIdToIndex[tokenId] = allProperties.length - 1;
        // Emit an event for the creation of the lease
        emit LeaseCreated(address(newLease), tokenId, owner, false);

        // Return the address of the new lease contract
        return address(newLease);
    }

    // /**
    //  * @dev Activates a lease by setting a tenant and transferring the required deposit.
    //  * @param tokenId Token ID of the property whose lease is to be activated.
    //  * @param tenant Address of the tenant who will occupy the property.
    //  */
    function activateLease(uint256 tokenId) public {
        uint256 index = tokenIdToIndex[tokenId];
        PropertyListing storage listing = allProperties[index];

        uint256 depositAmount = ResidentialLeaseAgreement(listing.leaseContract)
            .depositAmount();
        uint256 rentalPrice = ResidentialLeaseAgreement(listing.leaseContract)
            .rentalPrice();

        // Transfer the deposit and first rent payment to this contract and then to the owner
        require(
            utilityToken.allowance(msg.sender, listing.owner) >=
                depositAmount + rentalPrice,
            "Deposit + first rent amount not approved for transfer"
        );
        require(
            utilityToken.transferFrom(
                msg.sender,
                listing.owner,
                depositAmount + rentalPrice
            ),
            "Failed to transfer deposit + rent tokens"
        );

        // Ensure the lease is in a state that can be activated
        require(
            listing.state == LeaseState.Pending,
            "Lease cannot be activated from its current state"
        );

        // Check that the caller is not the owner of the property
        require(msg.sender != listing.owner, "Owner cannot be the tenant");

        // Set the caller as the tenant
        ResidentialLeaseAgreement(listing.leaseContract).setTenant(msg.sender);
        listing.state = LeaseState.Active;

        emit LeaseActivated(
            listing.leaseContract,
            msg.sender,
            listing.tokenId,
            true
        );
    }

    /**
     * @dev Allows a tenant to make a rental payment for an active lease using RentFi tokens.
     * @param tokenId Token ID of the property for which rent is being paid.
     */
    function payRent(uint256 tokenId) public {
        uint256 index = tokenIdToIndex[tokenId];
        PropertyListing storage listing = allProperties[index];

        // Ensure the lease is active
        require(listing.state == LeaseState.Active, "Lease is not active");

        // Retrieve the rental price from the lease agreement
        uint256 rentalPrice = ResidentialLeaseAgreement(listing.leaseContract)
            .rentalPrice();

        // Check that the required rent amount is approved for transfer from the tenant to this contract
        require(
            utilityToken.allowance(msg.sender, address(this)) >= rentalPrice,
            "Rent amount not approved for transfer"
        );

        // Transfer the rent to this contract
        require(
            utilityToken.transferFrom(msg.sender, address(this), rentalPrice),
            "Failed to transfer rent tokens"
        );

        // Transfer the rent from this contract to the property owner
        require(
            utilityToken.transfer(listing.owner, rentalPrice),
            "Failed to transfer rent to owner"
        );

        emit RentPaid(listing.leaseContract, rentalPrice, block.timestamp);
    }

    // /**
    //  * @dev Lists all properties registered within the factory.
    //  * @return An array of all registered property listings.
    //  */
    function listAllProperties()
        public
        view
        returns (PropertyListing[] memory)
    {
        // Check if the array has only the dummy element or is empty
        if (allProperties.length <= 1) {
            return new PropertyListing[](0); // Return an empty array if there's only the dummy element or none
        }

        // Create a new array with one less element than the original array
        PropertyListing[] memory filteredProperties = new PropertyListing[](
            allProperties.length - 1
        );

        // Copy all elements except the first (dummy) element
        for (uint i = 1; i < allProperties.length; i++) {
            filteredProperties[i - 1] = allProperties[i];
        }

        return filteredProperties;
    }

    /**
     * @dev Returns a detailed list of all properties managed through this factory. Each property's detailed information includes tenant, rental price, deposit amount, lease duration, and current lease state.
     * @return An array of DetailedPropertyListing structures containing comprehensive details about each registered property.
     * This function iterates through all property listings stored in the contract, retrieves the associated lease agreement details using the lease contract address, and constructs a detailed listing for each property.
     */
    function listAllPropertiesDetailed()
        public
        view
        returns (DetailedPropertyListing[] memory)
    {
        // Check if the array has only the dummy element or is empty
        if (allProperties.length <= 1) {
            return new DetailedPropertyListing[](0); // Return an empty array if there's only the dummy element or none
        }

        // Create a new array with one less element than the original array to exclude the dummy data at index 0
        DetailedPropertyListing[]
            memory detailedListings = new DetailedPropertyListing[](
                allProperties.length - 1
            );

        // Start from index 1 to skip the dummy data at index 0
        for (uint i = 1; i < allProperties.length; i++) {
            PropertyListing storage listing = allProperties[i];
            ResidentialLeaseAgreement lease = ResidentialLeaseAgreement(
                listing.leaseContract
            );

            DetailedPropertyListing
                memory detailedListing = DetailedPropertyListing({
                    tokenId: listing.tokenId,
                    NftUri: propertyRegistry.tokenURI(listing.tokenId),
                    leaseContract: listing.leaseContract,
                    owner: listing.owner,
                    state: listing.state,
                    tenant: lease.tenant(),
                    rentalPrice: lease.rentalPrice(),
                    depositAmount: lease.depositAmount(),
                    leaseDuration: lease.leaseDuration()
                });

            // Adjust the index to store in the new array starting from 0
            detailedListings[i - 1] = detailedListing;
        }

        return detailedListings;
    }

    // /**
    //  * @dev Retrieves detailed information about a specific lease.
    //  * @param tokenId Token ID of the property to query.
    //  * @return A tuple containing details about the lease including the lease contract address, tenant (if any), rental price, deposit amount, lease duration, and current state.
    //  */
    function getLeaseInfo(
        uint256 tokenId
    )
        public
        view
        returns (
            address leaseContract,
            address tenant,
            uint256 rentalPrice,
            uint256 depositAmount,
            uint256 leaseDuration,
            LeaseState state
        )
    {
        uint256 index = tokenIdToIndex[tokenId];
        PropertyListing storage listing = allProperties[index];
        ResidentialLeaseAgreement lease = ResidentialLeaseAgreement(
            listing.leaseContract
        );

        // Retrieve tenant, rental price, deposit amount, and lease duration from the lease contract
        tenant = lease.tenant();
        rentalPrice = lease.rentalPrice();
        depositAmount = lease.depositAmount();
        leaseDuration = lease.leaseDuration();
        state = listing.state;

        return (
            listing.leaseContract,
            tenant,
            rentalPrice,
            depositAmount,
            leaseDuration,
            state
        );
    }

    /**
     * @dev Updates the state of a lease agreement.
     * @param tokenId Token ID of the property whose lease state is to be updated.
     * @param newState New state to set for the lease (Pending, Active, Inactive).
     */
    function updateLeaseStatus(uint256 tokenId, LeaseState newState) public {
        uint256 index = tokenIdToIndex[tokenId];
        // Ensure that only the property owner can update the lease status
        require(
            msg.sender ==
                propertyRegistry.ownerOf(allProperties[index].tokenId),
            "Unauthorized"
        );
        // Ensure that only the pending contract can be deactivated
        require(
            allProperties[index].state == LeaseState.Pending,
            "Only the pending contract can be deactivated"
        );
        // Update the lease status in the array
        allProperties[index].state = newState;
        // Emit an event indicating the status update
        emit LeaseStateChanged(
            allProperties[index].leaseContract,
            allProperties[index].tokenId,
            newState
        );
    }

    function getNFTowner(
        uint256 tokenId
    ) public view returns (address NFTowner) {
        return propertyRegistry.ownerOf(tokenId);
    }

    // /**
    //  * @dev Deletes a lease from the factory storage; only callable by the property owner/leaseholder.
    //  * @param tokenId Token ID of the property whose lease is to be activated.
    //  */
    function deleteLeaseContract(uint256 tokenId) public {
        uint256 index = tokenIdToIndex[tokenId];
        PropertyListing storage listing = allProperties[index];
        require(msg.sender == listing.owner, "Unauthorized");
        require(listing.state == LeaseState.Pending, "Only the pending contract can be deleted");
        
        uint256 lastIndex = allProperties.length - 1;
        PropertyListing storage lastListing = allProperties[lastIndex];

        // Move the last element to the deleted element's index to maintain a compact array
        allProperties[index] = lastListing;
        tokenIdToIndex[lastListing.tokenId] = index;

        // Remove the last element
        allProperties.pop();
        delete tokenIdToIndex[tokenId];

        emit LeaseStateChanged(listing.leaseContract, tokenId, LeaseState.Deleted);
    }
}