// myWorkload.js
"use strict";

const { WorkloadModuleBase } = require("@hyperledger/caliper-core");

// Array to store issued token IDs
const issuedTokenIds = [];

/**
 * Workload module for the academic credential system.
 */
class MyWorkload extends WorkloadModuleBase {
  /**
   * Initializes the workload module.
   */
  async initializeWorkloadModule(
    workerIndex,
    totalWorkers,
    roundIndex,
    roundArguments,
    sutAdapter,
    sutContext
  ) {
    await super.initializeWorkloadModule(
      workerIndex,
      totalWorkers,
      roundIndex,
      roundArguments,
      sutAdapter,
      sutContext
    );

    this.contractID = "Token"; // Your contract ID from network-config.yaml
    this.issuerAddress = this.sutContext.contractDeployerAddress; // The address of the account that deploys/owns the contract
    // The above line assumes the first wallet in network-config.yaml is the deployer/owner.
    // If not, you might need to hardcode it or adjust how you get it.
  }

  /**
   * Generate a random 5-character string for unique IDs.
   * This mimics your Solidity contract's generateTokenId for off-chain arguments.
   * Note: This is simplified; the on-chain logic uses `keccak256(abi.encodePacked(nonce, msg.sender, block.timestamp))`.
   * For actual matching, you might need to call your contract's `generateTokenId` view function, but for testing,
   * using a unique string from Caliper side is sufficient for arguments.
   */
  _generateUniqueString(length = 5) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /**
   * Assemble the transaction for the current round.
   * @param {number} roundIndex The current round index.
   * @param {number} contextIndex The current client index.
   * @param {number} workerIndex The current worker index.
   * @param {number} opIndex The operation index in the current round.
   * @param {number} totalOps The total number of operations in the current round.
   * @returns {object} The transaction object.
   */
  async submitTransaction() {
    const args = this.roundArguments;
    const functionName = args.function;

    let txArgs = {};
    let readOnly = false;

    switch (functionName) {
      case "issueToken":
        // For issueToken, we need all the parameters
        const uniqueID = this._generateUniqueString(10); // A longer unique string for credentialID
        txArgs = {
          _issuerPublicKey: this.issuerAddress, // The owner's address
          _recipientPublicKey: `0x${this._generateUniqueString(40)}`, // Generate a random recipient address
          _name: `StudentName${this.workerIndex}-${this.opIndex}`,
          _credentialID: `CRED-${uniqueID}`, // Unique credential ID
          _credentialTitle: `Blockchain Cert ${uniqueID}`,
          _credentialType: "Certificate",
          _grade: "A+",
          _institution: "University of Caliper",
          _ipfsHash: `Qm${this._generateUniqueString(44)}`, // A dummy IPFS hash
        };
        break;
      case "isTokenValid":
      case "getToken":
      case "revokeToken":
        if (issuedTokenIds.length === 0) {
          // Fallback for when no tokens have been issued yet.
          // This scenario should be handled in your test plan,
          // e.g., ensure issueToken round runs first or pre-issue tokens.
          console.warn(
            `No tokens issued yet for ${functionName}. Skipping transaction.`
          );
          return; // Skip the transaction
        }
        // Pick a random token ID from the ones we've collected
        const randomTokenId =
          issuedTokenIds[Math.floor(Math.random() * issuedTokenIds.length)];
        txArgs = {
          _tokenId: randomTokenId,
        };
        if (functionName === "isTokenValid" || functionName === "getToken") {
          readOnly = true; // These are view functions
        }
        break;
      default:
        throw new Error(`Unknown function: ${functionName}`);
    }

    return this.sutAdapter.sendRequests({
      contractId: this.contractID,
      contractFunction: functionName,
      contractArguments: Object.values(txArgs), // Caliper expects an array of arguments in order
      readOnly: readOnly,
      txContext: {
        // Optionally pass additional context like sender
        // For onlyOwner, the transaction will be sent from the first wallet in network-config.yaml
        // if it's the deployer (which is the owner).
      },
    });
  }

  /**
   * Callback called after a transaction is successfully completed.
   * We'll use this to store the token IDs that were issued.
   */
  async cleanupWorkloadModule() {
    // No specific cleanup needed for this example, but you could log final stats here
  }

  async submitCallback(context, tx, result) {
    if (context.function === "issueToken" && result && result.result) {
      // Check if the result has the new token ID (which it does, as per your contract)
      // The result will be a Bytes object for Besu, need to convert to string
      const tokenId = this.sutAdapter.get;
      issuedTokenIds.push(tokenId);
      // console.log(`Worker ${this.workerIndex}: Issued token ${tokenId}, Total: ${issuedTokenIds.length}`);
    }
  }
}

// Ensure the module exports a function to create an instance
module.exports.createWorkloadModule = () => new MyWorkload();
