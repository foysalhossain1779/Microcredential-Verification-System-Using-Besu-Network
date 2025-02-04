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
import Navbar from "./Navbar";

const IssuedCredentialsPage = () => {
  const { user } = useContext(UserContext); // Access issuer public key from context
  const { contract } = useMetaMask(); // Access smart contract functions
  const [issuedTokens, setIssuedTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedTokenDetails, setSelectedTokenDetails] = useState(null);

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
    <div>
      <Navbar />
      <Box
        sx={{
          backgroundColor: "white",
          fontFamily: "Poppins, sans-serif",
          minHeight: "100vh",
          padding: "30px",
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          sx={{ fontWeight: "bold", marginBottom: "20px", color: "black" }}
        >
          Issued Credentials
        </Typography>
        <Paper
          elevation={3}
          sx={{
            padding: "20px",
            border: "2px solid black",
            borderRadius: "10px",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                margin: "20px 0",
              }}
            >
              <CircularProgress />
            </Box>
          )}
          {!loading && issuedTokens.length === 0 && (
            <Typography
              textAlign="center"
              sx={{ color: "red", fontWeight: "bold" }}
            >
              No credentials issued yet.
            </Typography>
          )}
          {issuedTokens.length > 0 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Token ID</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Recipient Public Key
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Credential Title
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
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
                            backgroundColor: "black",
                            color: "white",
                            borderRadius: "10px",
                            textTransform: "none",
                            marginRight: "10px",
                            "&:hover": {
                              backgroundColor: "white",
                              color: "black",
                              border: "2px solid black",
                            },
                          }}
                          onClick={() => handleViewDetails(token.tokenId)}
                        >
                          View
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "red",
                            color: "white",
                            borderRadius: "10px",
                            textTransform: "none",
                            "&:hover": {
                              backgroundColor: "#ffcccc",
                              color: "black",
                              border: "2px solid red",
                            },
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
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {message}
            </Typography>
          )}
        </Paper>

        {selectedTokenDetails && (
          <Box
            sx={{
              marginTop: "40px",
              padding: "20px",
              border: "2px solid black",
              borderRadius: "10px",
              maxWidth: "1000px",
              margin: "0 auto",
            }}
          >
            <Typography
              variant="h5"
              textAlign="center"
              sx={{ fontWeight: "bold", marginBottom: "20px", color: "black" }}
            >
              Token Details
            </Typography>
            <TableContainer>
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
    </div>
  );
};

export default IssuedCredentialsPage;
