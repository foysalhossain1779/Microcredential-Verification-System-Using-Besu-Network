import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
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
      const details = await contract.getToken(tokenId);
      setTokenDetails({
        token_id: details.token_id,
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
            padding: "40px",
            width: "100%",
            maxWidth: "700px",
            borderRadius: "10px",
            border: "2px solid black",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            textAlign="center"
            sx={{ fontWeight: "bold" }}
          >
            Verify Certificate
          </Typography>
          <TextField
            label="Token ID"
            value={tokenId}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            sx={{
              marginBottom: "20px",
              "& .MuiInputBase-root": {
                borderRadius: "10px",
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleVerify}
            sx={{
              backgroundColor: "black",
              color: "white",
              borderRadius: "10px",
              padding: "10px 20px",
              "&:hover": {
                backgroundColor: "white",
                color: "black",
                border: "2px solid black",
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
              sx={{ marginTop: "20px", textAlign: "center" }}
            >
              {error}
            </Typography>
          )}
          {tokenDetails && (
            <TableContainer
              sx={{
                marginTop: "30px",
                border: "2px solid black",
                borderRadius: "10px",
              }}
            >
              <Table>
                <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        Field
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        Value
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Token ID</TableCell>
                    <TableCell>{tokenDetails.token_id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Issuer Public Key</TableCell>
                    <TableCell>{tokenDetails.issuerPublicKey}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Recipient Public Key</TableCell>
                    <TableCell>{tokenDetails.recipientPublicKey}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>{tokenDetails.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Credential ID</TableCell>
                    <TableCell>{tokenDetails.credentialID}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Credential Title</TableCell>
                    <TableCell>{tokenDetails.credentialTitle}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Credential Type</TableCell>
                    <TableCell>{tokenDetails.credentialType}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Grade</TableCell>
                    <TableCell>{tokenDetails.grade}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Institution</TableCell>
                    <TableCell>{tokenDetails.institution}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>IPFS Hash</TableCell>
                    <TableCell>{tokenDetails.ipfsHash}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Revoked</TableCell>
                    <TableCell>
                      {tokenDetails.isRevoked ? "Yes" : "No"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </div>
  );
};

export default VerifyCertificate;
