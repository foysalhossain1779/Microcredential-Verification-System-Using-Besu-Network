// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Token {
    // State Variables & Constructor
    address public owner;
    uint256 public tokenCount; // Counter used to help generate unique token IDs

    // Variable to store the last issued token ID for easy lookup.
    string public lastIssuedTokenId;

    // Mapping now uses a string key (the token's unique ID) instead of an incremental uint256.
    mapping(string => TokenData) public tokens;

    // Allowed characters for the token ID.
    // Using uppercase, lowercase letters and digits (62 characters total).
    bytes internal constant ALPHABET =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    constructor() {
        owner = msg.sender;
    }

    // "onlyOwner" Modifier
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // Token Data Structure (renamed to TokenData for clarity)
    struct TokenData {
        string tokenId; // Unique token ID (a 5-character string)
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

    // Events (updated tokenId type to string)
    event TokenIssued(
        string tokenId,
        string name,
        string credentialTitle,
        string credentialID
    );
    event TokenRevoked(string tokenId);

    /**
     * @notice Generates a 5-character token ID using pseudo-randomness.
     * @param nonce A number (such as the current token count) to help generate randomness.
     * @return A 5-character string token ID.
     */
    function generateTokenId(
        uint256 nonce
    ) internal view returns (string memory) {
        bytes memory tokenId = new bytes(5);
        // Generate a pseudo-random hash from the nonce, caller address, and block timestamp.
        bytes32 randomHash = keccak256(
            abi.encodePacked(nonce, msg.sender, block.timestamp)
        );
        // Fill each of the 5 characters by selecting an index from the allowed ALPHABET.
        for (uint256 i = 0; i < 5; i++) {
            tokenId[i] = ALPHABET[uint8(randomHash[i]) % ALPHABET.length];
        }
        return string(tokenId);
    }

    /**
     * @notice Issues a new token (certificate) with a unique 5-character token ID.
     * @dev Only the contract owner can issue tokens.
     * @return newTokenId The unique 5-character token ID for the newly issued token.
     *
     * @dev Note: While the function returns the new token ID, when executed as a state-changing
     * transaction, Remix will not display the return value automatically. Instead, you can
     * check the `lastIssuedTokenId` public variable or the emitted event.
     */
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
    ) public onlyOwner returns (string memory newTokenId) {
        tokenCount++;

        // Generate a new token ID.
        newTokenId = generateTokenId(tokenCount);

        // Ensure uniqueness: if by any chance the token ID already exists, generate a new one.
        while (bytes(tokens[newTokenId].tokenId).length != 0) {
            tokenCount++;
            newTokenId = generateTokenId(tokenCount);
        }

        // Create the token data and store it in the mapping.
        tokens[newTokenId] = TokenData(
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

        // Update the public variable for easy lookup.
        lastIssuedTokenId = newTokenId;

        // Emit the TokenIssued event.
        emit TokenIssued(newTokenId, _name, _credentialTitle, _credentialID);

        return newTokenId;
    }

    /**
     * @notice Revokes an existing token (certificate) by its unique token ID.
     * @dev Only the contract owner can revoke tokens.
     * @param _tokenId The unique token ID of the certificate to be revoked.
     */
    function revokeToken(string memory _tokenId) public onlyOwner {
        require(
            bytes(tokens[_tokenId].tokenId).length != 0,
            "Token doesn't exist!"
        );
        TokenData storage t = tokens[_tokenId];
        require(!t.isRevoked, "Token is already revoked!");
        t.isRevoked = true;

        emit TokenRevoked(_tokenId);
    }

    /**
     * @notice Checks if a token (certificate) is valid (i.e. exists and is not revoked).
     * @param _tokenId The unique token ID to check.
     * @return True if the token exists and is not revoked.
     */
    function isTokenValid(string memory _tokenId) public view returns (bool) {
        require(
            bytes(tokens[_tokenId].tokenId).length != 0,
            "Token doesn't exist!"
        );
        return !tokens[_tokenId].isRevoked;
    }

    /**
     * @notice Retrieves the details of a token by its unique token ID.
     * @param _tokenId The unique toke
            t.institution,
            t.ipfsHash,
            t.isRevoked
        );
    }
}

0
n ID.
     * @return tokenId The token's unique ID.
     * @return issuerPublicKey The issuer's public key.
     * @return recipientPublicKey The recipient's public key.
     * @return name The name of the credential holder.
     * @return credentialID The credential's unique ID.
     * @return credentialTitle The title of the credential.
     * @return credentialType The type of credential.
     * @return grade The grade or level of achievement.
     * @return institution The issuing institution.
     * @return ipfsHash The IPFS hash of the credential data.
     * @return isRevoked The revocation status of the token.
     */
    function getToken(
        string memory _tokenId
    )
        public
        view
        returns (
            string memory tokenId,
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
        require(
            bytes(tokens[_tokenId].tokenId).length != 0,
            "Token doesn't exist!"
        );
        TokenData memory t = tokens[_tokenId];
        return (
            t.tokenId,
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
}
