// for QBFT

const PrivateKeyProvider = require("@truffle/hdwallet-provider");

// Private keys of the accounts from your QBFT network genesis file
const privateKeys = [
  "0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63",
  "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
  "0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f",
];

// Create a provider for Besu QBFT
const privateKeyProvider = new PrivateKeyProvider(
  privateKeys,
  "http://127.0.0.1:8545", // Adjust to the actual RPC endpoint of your QBFT network
  0, // Start index for accounts
  privateKeys.length // Number of accounts to use
);

module.exports = {
  networks: {
    qbft: {
      provider: privateKeyProvider, // Use the QBFT provider
      network_id: "1337", // Match the network ID in the genesis file
      gas: 4500000, // Block gas limit from the genesis file ("0x47b760")
      gasPrice: 0, // QBFT typically does not require a gas price
    },
  },

  // Compiler settings
  compilers: {
    solc: {
      version: "0.8.20", // Adjust Solidity version to match your contracts
      settings: {
        optimizer: {
          enabled: true, // Enable optimization for gas efficiency
          runs: 200,
        },
        evmVersion: "byzantium", // Match the EVM version in the genesis file
      },
    },
  },
};
