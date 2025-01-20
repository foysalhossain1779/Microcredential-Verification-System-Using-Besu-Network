// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Token {
    struct token {
        uint256 token_id;
        string student_name;
        string course;
        string institution;
        string ipfs_id; // Changed from uint256 to string
    }

    mapping(uint256 => token) public tokens; // Map token Id to token
    uint256 public tokenCount; // token id

    event TokenIssued(
        uint256 token_id,
        string student_name,
        string course,
        string ipfs_id // Changed from uint256 to string
    );

    function issueToken(
        string memory name,
        string memory _course,
        string memory _institution,
        string memory _ipfs_id // Changed from uint256 to string
    ) public {
        tokenCount++;
        tokens[tokenCount] = token(
            tokenCount,
            name,
            _course,
            _institution,
            _ipfs_id
        );
        emit TokenIssued(tokenCount, name, _course, _ipfs_id);
    }

    function verifyToken(uint256 token_id) public view returns (token memory) {
        require(token_id <= tokenCount, "Token doesn't exist!");
        return tokens[token_id];
    }
}
