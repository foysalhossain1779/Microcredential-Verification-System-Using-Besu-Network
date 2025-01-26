import React, { useState } from "react";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";
import { useMetaMask } from "../contexts/MetaMaskContext";
import Navbar from "./NavbarStudent";

const VerifyCertificate = () => {
  const { contract } = useMetaMask(); // Access contract from context
  const [tokenId, setTokenId] = useState("");
  const [tokenDetails, setTokenDetails] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setTokenId(e.target.value);
  };

  const handleVerify = async () => {
    if (!contract) {
      setError("Contract is not loaded yet.");
      return;
    }

    try {
      setError("");
      const details = await contract.getToken(parseInt(tokenId));
      setTokenDetails({
        token_id: details.token_id.toString(),
        issuerPublicKey: details.issuerPublicKey,
        recipientPublicKey: details.recipientPublicKey,
        name: details.name,
        credentialID: details.credentialID,
        credentialTitle: details.credentialTitle,
        credentialType: details.credentialType,
        grade: details.grade,
        institution: details.institution,
        ipfsHash: details.ipfsHash,
        isRevoked: details.isRevoked,
      });
    } catch (err) {
      console.error("Error verifying token:", err);
      setError("Failed to verify token. Please check the token ID.");
      setTokenDetails(null);
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
          marginTop: "50px",
          padding: "20px",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: "30px",
            width: "100%",
            maxWidth: "500px",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Verify Certificate
          </Typography>
          <TextField
            label="Token ID"
            type="number"
            value={tokenId}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <Button
            variant="contained"
            onClick={handleVerify}
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
            Verify
          </Button>
          {error && (
            <Typography
              variant="body1"
              color="error"
              sx={{ marginTop: "20px" }}
            >
              {error}
            </Typography>
          )}
          {tokenDetails && (
            <Box sx={{ marginTop: "20px", textAlign: "left" }}>
              <Typography variant="body1">
                <strong>Token ID:</strong> {tokenDetails.token_id}
              </Typography>
              <Typography variant="body1">
                <strong>Issuer Public Key:</strong>{" "}
                {tokenDetails.issuerPublicKey}
              </Typography>
              <Typography variant="body1">
                <strong>Recipient Public Key:</strong>{" "}
                {tokenDetails.recipientPublicKey}
              </Typography>
              <Typography variant="body1">
                <strong>Name:</strong> {tokenDetails.name}
              </Typography>
              <Typography variant="body1">
                <strong>Credential ID:</strong> {tokenDetails.credentialID}
              </Typography>
              <Typography variant="body1">
                <strong>Credential Title:</strong>{" "}
                {tokenDetails.credentialTitle}
              </Typography>
              <Typography variant="body1">
                <strong>Credential Type:</strong> {tokenDetails.credentialType}
              </Typography>
              <Typography variant="body1">
                <strong>Grade:</strong> {tokenDetails.grade}
              </Typography>
              <Typography variant="body1">
                <strong>Institution:</strong> {tokenDetails.institution}
              </Typography>
              <Typography variant="body1">
                <strong>IPFS Hash:</strong> {tokenDetails.ipfsHash}
              </Typography>
              <Typography variant="body1">
                <strong>Revoked:</strong>{" "}
                {tokenDetails.isRevoked ? "Yes" : "No"}
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </div>
  );
};

export default VerifyCertificate;
