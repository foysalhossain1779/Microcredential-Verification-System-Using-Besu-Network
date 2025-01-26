import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import Navbar from "./Navbar";
import { useMetaMask } from "../contexts/MetaMaskContext";

const TokenForm = () => {
  const { contract, account } = useMetaMask();

  const [formData, setFormData] = useState({
    name: "",
    institution: "",
    credentialID: "",
    credentialTitle: "",
    credentialType: "",
    grade: "",
    ipfsHash: "",
    recipientPublicKey: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract) {
      setMessage("Contract is not loaded yet.");
      return;
    }

    try {
      setMessage("Issuing token...");
      const tx = await contract.issueToken(
        account, // Issuer Public Key (connected account)
        formData.recipientPublicKey, // Recipient Public Key
        formData.name, // Name
        formData.credentialID, // Credential ID
        formData.credentialTitle, // Credential Title
        formData.credentialType, // Credential Type
        formData.grade, // Grade
        formData.institution, // Institution
        formData.ipfsHash // IPFS Hash
      );
      await tx.wait();
      setMessage("Token issued successfully!");
      setFormData({
        name: "",
        institution: "",
        credentialID: "",
        credentialTitle: "",
        credentialType: "",
        grade: "",
        ipfsHash: "",
        recipientPublicKey: "",
      });
    } catch (error) {
      console.error("Error issuing token:", error);
      setMessage("Failed to issue token.");
    }
  };

  return (
    <div>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "30px",
          padding: "20px",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: "30px",
            width: "100%",
            maxWidth: "600px",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Issue Token
          </Typography>
          <Typography variant="body1" gutterBottom>
            Connected Account (Issuer): {account}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Recipient Public Key"
              name="recipientPublicKey"
              value={formData.recipientPublicKey}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Student Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Institution"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Credential ID"
              name="credentialID"
              value={formData.credentialID}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Credential Title"
              name="credentialTitle"
              value={formData.credentialTitle}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Credential Type"
              name="credentialType"
              value={formData.credentialType}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="IPFS Hash"
              name="ipfsHash"
              value={formData.ipfsHash}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                marginTop: "20px",
                backgroundColor: "#9CC69B",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#79B4A9",
                },
              }}
              fullWidth
            >
              Submit
            </Button>
          </form>
          {message && (
            <Typography
              variant="body1"
              sx={{
                color: message.includes("successfully") ? "green" : "red",
                marginTop: "20px",
              }}
            >
              {message}
            </Typography>
          )}
        </Paper>
      </Box>
    </div>
  );
};

export default TokenForm;
