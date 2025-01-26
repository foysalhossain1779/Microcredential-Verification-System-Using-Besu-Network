// Import dependencies
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useMetaMask } from "../contexts/MetaMaskContext";
import Navbar from "./Navbar";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const DocumentDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Fetch document ID from URL params
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [generating, setGenerating] = useState(false); // Generating IPFS CID state
  const [submitting, setSubmitting] = useState(false); // Submitting to blockchain state
  const { user, logoutUser } = useContext(UserContext);

  const { contract, account } = useMetaMask(); // MetaMask context

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/documents/${id}`
        );
        setDocument(response.data); // Save document data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching document:", error);
        setLoading(false);
      }
    };
    fetchDocument();
  }, [id]);

  const generateIPFS = async () => {
    setGenerating(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/upload-to-ipfs/${id}`
      );
      setDocument({ ...document, ipfsCID: response.data.cid }); // Update document with IPFS CID
      alert("IPFS CID generated successfully!");
    } catch (error) {
      console.error("Error generating IPFS:", error);
      alert("Failed to generate IPFS CID");
    }
    setGenerating(false);
  };

  const submitToBlockchain = async () => {
    if (!contract) {
      alert("Contract is not loaded yet.");
      return;
    }

    setSubmitting(true);
    try {
      // Step 1: Submit to Blockchain
      const tx = await contract.issueToken(
        user.publicKey,
        document.publicKey,
        document.name,
        document.credentialID,
        document.course,
        document.credentialType,
        document.grade,
        document.institution,
        document.ipfsCID
      );

      await tx.wait();
      console.log("Transaction mined successfully!");

      // Step 2: Fetch the latest tokenCount
      const tokenCount = await contract.tokenCount();
      const tokenId = tokenCount.toString();
      console.log("Token ID:", tokenId);

      // Step 3: Validate Document ID
      if (!document._id) {
        throw new Error("Document ID is invalid or missing.");
      }

      // Step 4: Delete the Document from the Database using Axios
      console.log("Deleting document with ID:", document._id);
      const deleteResponse = await axios.delete(
        `http://localhost:5000/api/documents/${document._id}`
      );
      console.log("Document deleted successfully:", deleteResponse.data);

      // Step 5: Upload New Token to the Database using Axios
      const tokenData = {
        tokenId: tokenId,
        credentialTitle: document.course,
        recipientPublicKey: document.publicKey,
      };
      console.log("Uploading token data:", tokenData);

      const uploadResponse = await axios.post(
        `http://localhost:5000/api/tokens`,
        tokenData
      );
      console.log("Token data uploaded successfully:", uploadResponse.data);

      alert(
        "Document submitted to blockchain, deleted from database, and token saved successfully!"
      );
    } catch (error) {
      console.error("Error in submitToBlockchain:", error);
      alert(
        error.message || "Failed to complete the process. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
    navigate("/viewAll");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!document) {
    return (
      <Typography variant="h6" color="error" textAlign="center">
        Document not found.
      </Typography>
    );
  }

  const renderFilePreview = () => {
    if (document.mimetype.startsWith("image")) {
      return (
        <img
          src={`http://localhost:5000/${document.filepath}`}
          alt={document.filename}
          style={{ maxWidth: "100%", maxHeight: "400px", borderRadius: "8px" }}
        />
      );
    } else if (document.mimetype === "application/pdf") {
      return (
        <iframe
          src={`http://localhost:5000/${document.filepath}`}
          title={document.filename}
          style={{ width: "100%", height: "400px", border: "none" }}
        />
      );
    } else {
      return <Typography>Preview not available for this file type.</Typography>;
    }
  };

  return (
    <div>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px",
          backgroundColor: "#D7F2BA", // Tea Green
          minHeight: "100vh",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: "30px",
            width: "50%",
            backgroundColor: "#BDE4A8", // Celadon
          }}
        >
          <Typography variant="h4" gutterBottom textAlign="center">
            Document Details
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Name:</strong> {document.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Course:</strong> {document.course}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Institution:</strong> {document.institution}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>CredentialID:</strong> {document.credentialID}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Credential Type:</strong> {document.credentialType}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Grade:</strong> {document.grade}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>User Public Key:</strong> {document.publicKey}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Filename:</strong> {document.filename}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Upload Date:</strong>{" "}
            {new Date(document.uploadDate).toLocaleString()}
          </Typography>
          {document.ipfsCID ? (
            <>
              <Typography variant="body1" gutterBottom>
                <strong>IPFS CID:</strong> {document.ipfsCID}
              </Typography>
              <Button
                variant="contained"
                onClick={submitToBlockchain}
                disabled={submitting}
                sx={{
                  marginTop: "20px",
                  backgroundColor: "#79B4A9", // Cambridge Blue
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#676F54", // Reseda Green
                  },
                }}
              >
                {submitting ? "Submitting..." : "Submit to Blockchain"}
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={generateIPFS}
              disabled={generating}
              sx={{
                marginTop: "20px",
                backgroundColor: "#79B4A9", // Cambridge Blue
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#676F54", // Reseda Green
                },
              }}
            >
              {generating ? "Generating IPFS..." : "Generate IPFS"}
            </Button>
          )}
        </Paper>

        <Box
          sx={{
            width: "40%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {renderFilePreview()}
        </Box>
      </Box>
    </div>
  );
};

export default DocumentDetailPage;
