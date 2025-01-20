import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import TokenABI from "../../truffle/contracts/Token.json";
import TokenForm from "../tempFiles/TokenFormtemp";

const App = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          console.log("Requesting MetaMask access...");
          await window.ethereum.request({ method: "eth_requestAccounts" });
          console.log("MetaMask access granted.");

          // Use BrowserProvider instead of Web3Provider
          const provider = new ethers.BrowserProvider(window.ethereum);
          console.log("Provider initialized:", provider);

          const signer = await provider.getSigner();
          console.log("Signer retrieved:", signer);

          const contractAddress = "0x42699A7612A82f1d9C36148af9C77354759b210b";
          const tokenContract = new ethers.Contract(
            contractAddress,
            TokenABI.abi,
            signer
          );

          console.log("Contract loaded:", tokenContract);
          console.log("Loaded Contract:", tokenContract);
          setContract(tokenContract);

          const userAccount = await signer.getAddress();
          console.log("Connected account:", userAccount);
          setAccount(userAccount);
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
        }
      } else {
        alert("MetaMask is not installed!");
      }
    };

    init();
  }, []);

  return (
    <div>
      <h1>Token Contract Interaction</h1>
      <p>Connected Account: {account}</p>
      {contract ? (
        <div>
          <p>Contract Address: {contract.target}</p>
          <TokenForm contract={contract} />
        </div>
      ) : (
        <p>Loading contract...</p>
      )}
    </div>
  );
};

export default App;
