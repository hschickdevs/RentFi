// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

// Importing necessary components from the OpenZeppelin Contracts library
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

// The contract is inheriting from ERC721, ERC721URIStorage, and Ownable
contract PropertyRegistryNFT is ERC721, ERC721URIStorage, Ownable {
    // Variable to keep track of the next token ID to be minted
    uint256 private _nextTokenId;
    // Mapping to track which URIs have already been used to ensure uniqueness
    mapping(string => bool) private _usedURIs;

    // Constructor sets up the NFT with a name and a symbol, and sets the initial owner
    constructor(address initialOwner)
        ERC721("PropertyNFT", "PNFT")
        Ownable(initialOwner) // This is likely incorrect due to Ownable not having a constructor taking address.
    {}

    // Function to safely mint a new token ensuring the URI has not been used before
    function safeMint(address to, string memory uri) public onlyOwner {
        require(!_usedURIs[uri], "URI already used"); // Ensure the URI is unique
        uint256 tokenId = _nextTokenId++; // Increment token ID for each new mint
        _safeMint(to, tokenId); // Mint the token safely
        _setTokenURI(tokenId, uri); // Set the token's URI
        _usedURIs[uri] = true; // Mark this URI as used
    }

    // Function to update the URI of a specific token, ensuring the new URI hasn't been used
    function updateTokenURI(uint256 tokenId, string memory newURI) public onlyOwner {
        require(ownerOf(tokenId) != address(0), "ERC721URIStorage: URI set of nonexistent token"); // Check that the token exists
        require(!_usedURIs[newURI], "New URI already used"); // Ensure the new URI is unique

        // Optionally clear the old URI if necessary
        string memory oldURI = tokenURI(tokenId);
        if (_usedURIs[oldURI]) {
            _usedURIs[oldURI] = false;
        }
        _setTokenURI(tokenId, newURI); // Update the token's URI
        _usedURIs[newURI] = true; // Mark the new URI as used
    }

    // Overridden function from ERC721 and ERC721URIStorage to get the token's URI
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // Overridden function to check for supported interfaces
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
