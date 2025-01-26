import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useMetaMask } from "../contexts/MetaMaskContext"; // Assuming MetaMask context is already set up

const ConnectToOtherChainsForm = () => {
  const { contract, account } = useMetaMask(); // Get contract and account from MetaMask context
  const [formData, setFormData] = useState({
    contractAddress: "",
    tokenId: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract) {
      setMessage("Contract is not connected yet.");
      return;
    }

    try {
      setMessage("Processing transaction...");
      const tx = await contract.connectToOtherChains(
        formData.contractAddress,
        formData.tokenId
      );
      await tx.wait();
      setMessage("Token successfully imported from another chain!");
    } catch (error) {
      console.error("Error during contract interaction:", error);
      setMessage("Failed to connect to other chains. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#D7F2BA", // Tea Green
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "400px",
          padding: "30px",
          backgroundColor: "#BDE4A8", // Celadon
          borderRadius: "10px",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          textAlign="center"
          sx={{ fontWeight: "bold", color: "#676F54" }}
        >
          Connect to Other Chains
        </Typography>
        <Typography
          variant="subtitle1"
          textAlign="center"
          sx={{ marginBottom: "20px", color: "#79B4A9" }}
        >
          Import tokens from external blockchains
        </Typography>
        <form onSubmit={handleSubmit}>
          {message && (
            <Typography
              variant="body2"
              color={message.includes("Failed") ? "error" : "success"}
              sx={{ marginBottom: "15px" }}
            >
              {message}
            </Typography>
          )}
          <TextField
            label="Contract Address"
            name="contractAddress"
            value={formData.contractAddress}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Token ID"
            name="tokenId"
            value={formData.tokenId}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              marginTop: "20px",
              backgroundColor: "#676F54", // Reseda Green
              color: "#fff",
              "&:hover": {
                backgroundColor: "#79B4A9", // Cambridge Blue
              },
            }}
          >
            Import Token
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ConnectToOtherChainsForm;
