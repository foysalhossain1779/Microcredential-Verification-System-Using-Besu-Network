// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IExternalBlockchain {
    function getTokenData(
        uint256 tokenId
    )
        external
        view
        returns (
            uint256 token_id,
            address issuerPublicKey,
            address recipientPublicKey,
            string memory name,
            string memory credentialID,
            string memory credentialTitle,
            string memory credentialType,
            string memory grade,
            string memory institution,
            string memory ipfsHash,
            bool isRevoked
        );
}

contract Token {
    // State Variables & Constructor
    address public owner;
    uint256 public tokenCount; // Counter for locally issued tokens
    uint256 public importedTokenCount = 1000; // Counter for imported tokens, starts at 1000
    mapping(uint256 => token) public tokens; // Mapping for tokens (local and imported)

    constructor() {
        owner = msg.sender;
    }

    // "onlyOwner" Modifier
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // Token Data Structure
    struct token {
        uint256 token_id;
        address issuerPublicKey; // Public key of the issuer
        address recipientPublicKey; // Public key of the recipient
        string name; // Name of the credential holder
        string credentialID; // Unique ID for the credential
        string credentialTitle; // Title of the credential
        string credentialType; // Type of credential (e.g., Certificate, Diploma)
        string grade; // Grade or level of achievement
        string institution; // Name of the issuing institution
        string ipfsHash; // IPFS hash of the credential data
        bool isRevoked; // Revocation status
    }

    // Events
    event TokenIssued(
        uint256 tokenId,
        string name,
        string credentialTitle,
        string credentialID
    );
    event TokenRevoked(uint256 tokenId);
    event CrossChainTokenImported(
        uint256 newTokenId,
        uint256 externalTokenId,
        string sourceChain
    );

    // Core Functions
    function issueToken(
        address _issuerPublicKey,
        address _recipientPublicKey,
        string memory _name,
        string memory _credentialID,
        string memory _credentialTitle,
        string memory _credentialType,
        string memory _grade,
        string memory _institution,
        string memory _ipfsHash
    ) public onlyOwner {
        tokenCount++;
        uint256 newTokenId = tokenCount; // Local token IDs start from 1

        tokens[newTokenId] = token(
            newTokenId,
            _issuerPublicKey,
            _recipientPublicKey,
            _name,
            _credentialID,
            _credentialTitle,
            _credentialType,
            _grade,
            _institution,
            _ipfsHash,
            false
        );

        emit TokenIssued(newTokenId, _name, _credentialTitle, _credentialID);
    }

    function revokeToken(uint256 _tokenId) public onlyOwner {
        require(tokens[_tokenId].token_id != 0, "Token doesn't exist!");
        token storage t = tokens[_tokenId];
        require(!t.isRevoked, "Token is already revoked!");
        t.isRevoked = true;

        emit TokenRevoked(_tokenId);
    }

    function isTokenValid(uint256 _tokenId) public view returns (bool) {
        require(tokens[_tokenId].token_id != 0, "Token doesn't exist!");
        return !tokens[_tokenId].isRevoked;
    }

    // Unified getToken function for all tokens
    function getToken(
        uint256 tokenId
    )
        public
        view
        returns (
            uint256 token_id,
            address issuerPublicKey,
            address recipientPublicKey,
            string memory name,
            string memory credentialID,
            string memory credentialTitle,
            string memory credentialType,
            string memory grade,
            string memory institution,
            string memory ipfsHash,
            bool isRevoked
        )
    {
        require(tokens[tokenId].token_id != 0, "Token doesn't exist!");
        token memory t = tokens[tokenId];
        return (
            t.token_id,
            t.issuerPublicKey,
            t.recipientPublicKey,
            t.name,
            t.credentialID,
            t.credentialTitle,
            t.credentialType,
            t.grade,
            t.institution,
            t.ipfsHash,
            t.isRevoked
        );
    }

    // Interoperability Function
    function connectToOtherChains(
        address externalContract,
        uint256 externalTokenId
    ) public onlyOwner {
        // Fetch token data from the external contract
        IExternalBlockchain otherChain = IExternalBlockchain(externalContract);
        (
            uint256 tokenId,
            address issuerPublicKey,
            address recipientPublicKey,
            string memory name,
            string memory credentialID,
            string memory credentialTitle,
            string memory credentialType,
            string memory grade,
            string memory institution,
            string memory ipfsHash,
            bool isRevoked
        ) = otherChain.getTokenData(externalTokenId);

        // Generate a new token ID for imported tokens
        importedTokenCount++; // Imported token IDs start from 1000
        uint256 newTokenId = importedTokenCount;

        // Import the token into your blockchain
        tokens[newTokenId] = token(
            newTokenId,
            issuerPublicKey,
            recipientPublicKey,
            name,
            credentialID,
            credentialTitle,
            credentialType,
            grade,
            institution,
            ipfsHash,
            isRevoked
        );

        emit CrossChainTokenImported(
            newTokenId,
            tokenId,
            "External Blockchain"
        );
    }
}
