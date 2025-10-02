"use strict";

const { WorkloadModuleBase } = require("@hyperledger/caliper-core");

class GetTokenWorkload extends WorkloadModuleBase {
  constructor() {
    super();
    this.contractId = "Token";
    this.tokenId = "";
  }vmxkvfkl

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

    // Retrieve the tokenId from the benchmark arguments
    if (!this.roundArguments.tokenId) {
      throw new Error(
        'GetTokenWorkload: "tokenId" is not set in the benchmark file'
      );
    }
    this.tokenId = this.roundArguments.tokenId;
  }

  async submitTransaction() {
    // This transaction is a read-only query
    const tx = {
      contract: this.contractId,
      verb: "getToken",
      args: [this.tokenId], // Use the tokenId passed from the benchmark file
      readOnly: true,
    };
    return this.sutAdapter.sendRequests(tx);
  }
}

function createWorkloadModule() {
  return new GetTokenWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
