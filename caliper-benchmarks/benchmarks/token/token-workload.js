"use strict";

const { WorkloadModuleBase } = require("@hyperledger/caliper-core");

class TokenWorkload extends WorkloadModuleBase {
  constructor() {
    super();
    this.contractId = "Token";
  }

  async initializeWorkloadModule(
    workerIndex,
    totalWorkers,
    roundIndex,
    roundArguments,
    sutAdapter,
    sutContext
  ) {
    // The initializeWorkloadModule is called for each round.
    // We just need to call the base class implementation.
    await super.initializeWorkloadModule(
      workerIndex,
      totalWorkers,
      roundIndex,
      roundArguments,
      sutAdapter,
      sutContext
    );
  }

  async submitTransaction() {
    // Use workerIndex and txIndex for a guaranteed unique ID per transaction
    const tokenId = `CRED-${this.workerIndex}-${this.txIndex}`;
    const tx = {
      contract: this.contractId, // Use the contract ID string from the network config
      verb: "issueToken", // Use 'verb' instead of 'function'

      args: [
        this.sutContext.fromAddress,
        this.sutContext.fromAddress,
        "John Doe",
        tokenId,
        "Certificate of Completion",
        "Certificate",
        "A",
        "Example University",
        "QmExampleIPFSHash",
      ],
      readOnly: false, // This is a transaction, not a read-only call
    };
    return this.sutAdapter.sendRequests(tx);
  }
}

function createWorkloadModule() {
  return new TokenWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
