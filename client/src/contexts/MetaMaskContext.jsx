import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import TokenABI from "../../../truffle/contracts/Token.json";

const MetaMaskContext = createContext();

export const MetaMaskProvider = ({ children }) => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });

          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contractAddress = "0xa50a51c09a5c451C52BB714527E1974b686D8e77";
          const tokenContract = new ethers.Contract(
            contractAddress,
            TokenABI.abi,
            signer
          );

          setContract(tokenContract);
          const userAccount = await signer.getAddress();
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
    <MetaMaskContext.Provider value={{ contract, account }}>
      {children}
    </MetaMaskContext.Provider>
  );
};

export const useMetaMask = () => useContext(MetaMaskContext);
