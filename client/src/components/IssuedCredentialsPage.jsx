import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
} from "@mui/material";
import { UserContext } from "../contexts/UserContext";
import { useMetaMask } from "../contexts/MetaMaskContext";

const IssuedCredentialsPage = () => {
  const { user } = useContext(UserContext); // Access issuer public key from context
  const { contract } = useMetaMask(); // Access smart contract functions
  const [issuedTokens, setIssuedTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedTokenDetails, setSelectedTokenDetails] = useState(null);

  // Fetch issued tokens on component load
  useEffect(() => {
    const fetchIssuedTokens = async () => {
      if (!user?.publicKey) return;

      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/tokens?issuerPublicKey=${user.publicKey}`
        );
        const tokens = await response.json();
        setIssuedTokens(tokens);
      } catch (error) {
        console.error("Error fetching issued tokens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssuedTokens();
  }, [user]);

  // Handle revoke token
  const handleRevoke = async (tokenId) => {
    if (!contract) return;

    try {
      setLoading(true);
      await contract.revokeToken(tokenId);
      setMessage(`Token ${tokenId} successfully revoked.`);
      setIssuedTokens((prevTokens) =>
        prevTokens.filter((token) => token.tokenId !== tokenId)
      );
    } catch (error) {
      console.error("Error revoking token:", error);
      setMessage("Failed to revoke the token. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle view token details
  const handleViewDetails = async (tokenId) => {
    if (!contract) return;

    try {
      setLoading(true);
      const tokenDetails = await contract.getToken(tokenId);
      setSelectedTokenDetails({
        tokenId: tokenDetails.tokenId,
        issuerPublicKey: tokenDetails.issuerPublicKey,
        recipientPublicKey: tokenDetails.recipientPublicKey,
        name: tokenDetails.name,
        credentialID: tokenDetails.credentialID,
        credentialTitle: tokenDetails.credentialTitle,
        credentialType: tokenDetails.credentialType,
        grade: tokenDetails.grade,
        institution: tokenDetails.institution,
        ipfsHash: tokenDetails.ipfsHash,
        isRevoked: tokenDetails.isRevoked,
      });
    } catch (error) {
      console.error("Error fetching token details:", error);
      setMessage("Failed to fetch token details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#D7F2BA", // Tea Green
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Typography
        variant="h4"
        textAlign="center"
        sx={{ fontWeight: "bold", marginBottom: "20px", color: "#676F54" }}
      >
        Issued Credentials
      </Typography>
      <Paper elevation={3} sx={{ padding: "20px", backgroundColor: "#fff" }}>
        {loading && (
          <Box
            sx={{ display: "flex", justifyContent: "center", margin: "20px" }}
          >
            <CircularProgress />
          </Box>
        )}
        {!loading && issuedTokens.length === 0 && (
          <Typography textAlign="center" sx={{ color: "#d32f2f" }}>
            No credentials issued yet.
          </Typography>
        )}
        {issuedTokens.length > 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Token ID</TableCell>
                  <TableCell>Recipient Public Key</TableCell>
                  <TableCell>Credential Title</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {issuedTokens.map((token) => (
                  <TableRow key={token.tokenId}>
                    <TableCell>{token.tokenId}</TableCell>
                    <TableCell>{token.recipientPublicKey}</TableCell>
                    <TableCell>{token.credentialTitle}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#1976d2",
                          color: "#fff",
                          marginRight: "10px",
                        }}
                        onClick={() => handleViewDetails(token.tokenId)}
                      >
                        View
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#d32f2f",
                          color: "#fff",
                        }}
                        onClick={() => handleRevoke(token.tokenId)}
                      >
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {message && (
          <Typography
            sx={{
              marginTop: "20px",
              color: message.includes("Failed") ? "red" : "green",
            }}
          >
            {message}
          </Typography>
        )}
      </Paper>

      {/* Render selected token details in a table */}
      {selectedTokenDetails && (
        <Box sx={{ marginTop: "40px" }}>
          <Typography
            variant="h5"
            textAlign="center"
            sx={{ marginBottom: "20px", color: "#676F54" }}
          >
            Token Details
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {Object.entries(selectedTokenDetails).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </TableCell>
                    <TableCell>{value?.toString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default IssuedCredentialsPage;
