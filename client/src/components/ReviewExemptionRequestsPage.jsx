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
import Navbar from "./NavbarInst";

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
          fontFamily: "Poppins, sans-serif",
          backgroundColor: "white",
          minHeight: "100vh",
          padding: "30px",
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          sx={{
            fontWeight: "bold",
            marginBottom: "30px",
            color: "black",
            fontSize: "32px",
          }}
        >
          Review Exemption Requests
        </Typography>

        {/* Pending Requests Section */}
        <Paper
          elevation={3}
          sx={{
            padding: "30px",
            marginBottom: "30px",
            border: "2px solid black",
            borderRadius: "10px",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            Pending Requests
          </Typography>
          {pendingRequests.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Student Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Course</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Tokens</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
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
                            backgroundColor: "black",
                            color: "white",
                            fontWeight: "bold",
                            textTransform: "none",
                            marginRight: "10px",
                            borderRadius: "10px",
                            "&:hover": {
                              backgroundColor: "white",
                              color: "black",
                              border: "2px solid black",
                            },
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleAction(request._id, "decline")}
                          disabled={loading}
                          variant="contained"
                          sx={{
                            backgroundColor: "red",
                            color: "white",
                            fontWeight: "bold",
                            textTransform: "none",
                            borderRadius: "10px",
                            "&:hover": {
                              backgroundColor: "#ffcccc",
                              color: "black",
                              border: "2px solid red",
                            },
                          }}
                        >
                          Decline
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography
              textAlign="center"
              sx={{ color: "gray", fontWeight: "bold" }}
            >
              No pending requests.
            </Typography>
          )}
        </Paper>

        {/* Processed Requests Section */}
        <Paper
          elevation={3}
          sx={{
            padding: "30px",
            marginBottom: "30px",
            border: "2px solid black",
            borderRadius: "10px",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            Processed Requests
          </Typography>
          {processedRequests.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Student Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Course</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Tokens</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
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
          ) : (
            <Typography
              textAlign="center"
              sx={{ color: "gray", fontWeight: "bold" }}
            >
              No processed requests.
            </Typography>
          )}
        </Paper>

        {/* Verify Certificate Section */}
        <Paper
          elevation={3}
          sx={{
            padding: "30px",
            maxWidth: "500px",
            margin: "0 auto",
            border: "2px solid black",
            borderRadius: "10px",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            Verify Certificate
          </Typography>
          <TextField
            label="Token ID"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            fullWidth
            required
            margin="normal"
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: "10px",
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleVerifyToken}
            sx={{
              marginTop: "20px",
              backgroundColor: "black",
              color: "white",
              fontWeight: "bold",
              borderRadius: "10px",
              textTransform: "none",
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
            <Box sx={{ marginTop: "20px", textAlign: "left" }}>
              {Object.entries(tokenDetails).map(([key, value]) => (
                <Typography variant="body1" key={key} gutterBottom>
                  <strong>{`${
                    key.charAt(0).toUpperCase() + key.slice(1)
                  }:`}</strong>{" "}
                  {value?.toString()}
                </Typography>
              ))}
            </Box>
          )}
        </Paper>
      </Box>
    </div>
  );
};

export default ReviewExemptionRequestsPage;
