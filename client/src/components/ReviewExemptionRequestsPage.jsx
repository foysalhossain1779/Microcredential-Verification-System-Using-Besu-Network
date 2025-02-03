import React, { useEffect, useState } from "react";
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
  TextField,
} from "@mui/material";
import axios from "axios";
import { useMetaMask } from "../contexts/MetaMaskContext";
import Navbar from "./Navbar";

const ReviewExemptionRequestsPage = () => {
  const { contract } = useMetaMask(); // Access contract from MetaMask context
  const [pendingRequests, setPendingRequests] = useState([]);
  const [processedRequests, setProcessedRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const [tokenDetails, setTokenDetails] = useState(null);
  const [error, setError] = useState("");

  // Load exemption requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/exemption-requests"
        );
        const requests = response.data;
        setPendingRequests(requests.filter((req) => req.status === "Pending"));
        setProcessedRequests(
          requests.filter((req) => req.status !== "Pending")
        );
      } catch (error) {
        console.error("Error fetching exemption requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleAction = async (requestId, action) => {
    setLoading(true);
    try {
      await axios.patch(
        `http://localhost:5000/api/exemption-requests/${requestId}`,
        {
          status: action === "accept" ? "Accepted" : "Rejected",
        }
      );
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));
      const updatedRequest = pendingRequests.find(
        (req) => req._id === requestId
      );
      setProcessedRequests((prev) => [
        ...prev,
        {
          ...updatedRequest,
          status: action === "accept" ? "Accepted" : "Rejected",
        },
      ]);
    } catch (error) {
      console.error("Error updating request status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToken = async () => {
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
          backgroundColor: "#D7F2BA",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          sx={{ fontWeight: "bold", marginBottom: "20px", color: "#676F54" }}
        >
          Review Exemption Requests
        </Typography>

        <Paper elevation={3} sx={{ padding: "20px", backgroundColor: "#fff" }}>
          <Typography variant="h5" gutterBottom>
            Pending Requests
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Tokens</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingRequests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>{request.studentName}</TableCell>
                    <TableCell>{request.course}</TableCell>
                    <TableCell>{request.tokenIds.join(", ")}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleAction(request._id, "accept")}
                        disabled={loading}
                        variant="contained"
                        sx={{
                          backgroundColor: "#1976d2",
                          color: "#fff",
                          marginRight: "10px",
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleAction(request._id, "decline")}
                        disabled={loading}
                        variant="contained"
                        sx={{ backgroundColor: "#d32f2f", color: "#fff" }}
                      >
                        Decline
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Paper
          elevation={3}
          sx={{ padding: "20px", marginTop: "20px", backgroundColor: "#fff" }}
        >
          <Typography variant="h5" gutterBottom>
            Processed Requests
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Tokens</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {processedRequests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>{request.studentName}</TableCell>
                    <TableCell>{request.course}</TableCell>
                    <TableCell>{request.tokenIds.join(", ")}</TableCell>
                    <TableCell>{request.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Box sx={{ marginTop: "40px" }}>
          <Typography
            variant="h5"
            gutterBottom
            textAlign="center"
            sx={{ fontWeight: "bold", color: "#676F54" }}
          >
            Verify Certificate
          </Typography>
          <Paper
            elevation={3}
            sx={{
              padding: "30px",
              width: "100%",
              maxWidth: "500px",
              margin: "0 auto",
              textAlign: "center",
              backgroundColor: "#fff",
            }}
          >
            <TextField
              label="Token ID"
              type="number"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <Button
              variant="contained"
              onClick={handleVerifyToken}
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
                  <strong>Credential Type:</strong>{" "}
                  {tokenDetails.credentialType}
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
      </Box>
    </div>
  );
};

export default ReviewExemptionRequestsPage;
