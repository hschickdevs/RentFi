# Residential Lease Agreement Smart Contracts

This documentation outlines the functionality and usage of two Solidity smart contracts: `LeaseAgreementFactory` and `ResidentialLeaseAgreement`. These contracts provide a blockchain-based solution for managing residential lease agreements.

## LeaseAgreementFactory Contract

The `LeaseAgreementFactory` contract serves as a factory for creating, activating, and managing lease agreements.

### Functions

1. **createLeaseContract**
   - **Description**: Creates a new lease contract for a specified property.
   - **Inputs**:
     - `tokenId`: The token ID of the property to be leased, token ID that has not been listed.
     - `rentalPrice`: The rental price per payment period.
     - `depositAmount`: The amount of deposit required to secure the lease.
     - `leaseDuration`: The duration of the lease in payment periods.
   - **Output**: The address of the newly created lease contract.

2. **activateLease**
   - **Description**: Activates a lease by setting a tenant (the owner cannot be set as a tenant) and transferring the required deposit.
   - **Inputs**:
     - `tokenId`: The token ID of the property whose lease is to be activated.
   - **Requirements**: The function requires the caller to send an amount of Ether equal to the deposit specified in the lease contract.

3. **payRent**
   - **Description**: Allows a tenant to make a rental payment for an active lease.
   - **Input**:
     - `tokenId`: The token ID of the property for which rent is being paid.
   - **Requirements**: The caller must send an amount of Ether equal to the rental price as specified in the lease contract.

4. **updateLeaseStatus**
   - **Description**: Updates the state of a lease agreement.
   - **Inputs**:
     - `tokenId`: The token ID of the property whose lease state is to be updated.
     - `newState`: The new state to set for the lease (Pending, Active, Inactive).

5. **listAllProperties**
   - **Description**: Lists all properties registered within the factory.
   - **Output**: An array of all registered property listings. Each listing contains:
     - `tokenId`: The token ID of the property.
     - `leaseContract`: The address of the deployed lease contract for this property.
     - `owner`: The owner of the property.
     - `state`: The current state of the lease (Pending, Active, Inactive).

6. **listAllPropertiesDetailed**
   - **Description**: Provides detailed listings of all properties managed by the factory, including additional details about each lease.
   - **Output**: An array of detailed property listings. Each detailed listing includes:
     - `tokenId`: The token ID of the property.
     - `leaseContract`: The address of the deployed lease contract.
     - `owner`: The owner of the property.
     - `state`: The current state of the lease.
     - `tenant`: The address of the tenant.
     - `rentalPrice`: The rental price per payment period.
     - `depositAmount`: The deposit required to secure the lease.
     - `leaseDuration`: The duration of the lease.

7. **getLeaseInfo**
   - **Description**: Retrieves detailed information about a specific lease by its property token ID.
   - **Input**:
     - `tokenId`: The token ID of the property to query.
   - **Output**: Detailed information about the lease, including the lease contract address, tenant (if any), rental price, deposit amount, lease duration, and current lease state.


### Events

The `LeaseAgreementFactory` contract emits the following events to notify front-end applications about significant actions and state changes:

- `LeaseCreated`: Emitted when a new lease contract is created.
- `LeaseActivated`: Emitted when a lease is activated.
- `RentPaid`: Emitted when a tenant makes a rental payment.
- `LeaseStateChanged`: Emitted when the state of a lease agreement is updated.

## ResidentialLeaseAgreement Contract

The `ResidentialLeaseAgreement` contract models a typical residential lease agreement and contains the essential details such as rental price, deposit amount, lease duration, and tenant information.

### Constructor

```solidity
constructor(uint256 _tokenId, uint256 _rentalPrice, uint256 _depositAmount, uint256 _leaseDuration, address payable _owner)
```
- Parameters:
  - `_tokenId`: The unique ID of the property, often linked to an NFT.
  - `_rentalPrice`: The monthly rent amount expected from the tenant.
  - `_depositAmount`: The initial security deposit required to secure the lease.
  - `_leaseDuration`: The length of the lease term in payment periods.
  - `_owner`: The address of the property owner, who receives the rent and deposit payments.

### Functions

1. **setTenant**
   - Description: Sets the tenant for the lease. This function is typically called by the `LeaseAgreementFactory` contract to initialize a new tenant.
   - Input:
     - `_tenant`: The address of the new tenant.

2. **terminateLease** (Commented out)
   - Description: Terminates the lease agreement. This function can be initiated by either the tenant or the owner.
   - Requirement: The caller must be either the tenant or the owner.

### Events

The `ResidentialLeaseAgreement` contract emits the following event:

- `TenantSet`: Fired when a new tenant is associated with the lease.

## Front-end Integration

Front-end developers can interact with these smart contracts using Web3.js or Ethers.js libraries. The key steps are:

1. Obtain the ABI (Application Binary Interface) and deployed contract addresses.
2. Initialize a contract instance using the ABI and contract address.
3. Call the contract functions, passing the required parameters and handling the returned values.
4. Listen for contract events to stay updated on the state changes.

For example, to create a new lease contract, the front-end can call the `createLeaseContract` function on the `LeaseAgreementFactory` contract instance. To activate a lease, the front-end can call the `activateLease` function, passing the required `tokenId` and `tenant` address.

Additionally, the front-end can utilize the `PropertyRegistryNFT` contract to retrieve the metadata associated with a specific property by calling the `tokenURI` function and passing the `tokenId` of the property, it will return a json file. 

By utilizing these smart contracts, front-end developers can build decentralized applications that manage residential lease agreements on the blockchain, providing a secure and transparent solution for property owners and tenants.         
