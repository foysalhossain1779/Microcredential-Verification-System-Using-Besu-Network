import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useMetaMask } from "../contexts/MetaMaskContext";
import Navbar from "./Navbar";
import { UserContext } from "../contexts/UserContext";

const DocumentDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Fetch document ID from URL params
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [generating, setGenerating] = useState(false); // Generating IPFS CID state
  const [submitting, setSubmitting] = useState(false); // Submitting to blockchain state
  const { user } = useContext(UserContext);
  const { contract } = useMetaMask(); // MetaMask context

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

      const tokenCount = await contract.lastIssuedTokenId();
      const tokenId = tokenCount.toString();

      await axios.delete(`http://localhost:5000/api/documents/${document._id}`);

      const tokenData = {
        tokenId: tokenId,
        credentialTitle: document.course,
        recipientPublicKey: document.publicKey,
        issuerPublicKey: user.publicKey,
      };

      await axios.post(`http://localhost:5000/api/tokens`, tokenData);

      alert("Document submitted to blockchain and token saved successfully!");
    } catch (error) {
      console.error("Error in submitToBlockchain:", error);
      alert("Failed to complete the process. Please try again.");
    } finally {
      setSubmitting(false);
    }
    navigate("/viewAll");
  };

  const renderFilePreview = () => {
    if (document.mimetype.startsWith("image")) {
      return (
        <img
          src={`http://localhost:5000/${document.filepath}`}
          alt={document.filename}
          style={{ maxWidth: "100%", borderRadius: "10px" }}
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
      return (
        <Typography variant="body1" color="gray" textAlign="center">
          Preview not available for this file type.
        </Typography>
      );
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "black",
          color: "white",
        }}
      >
        <CircularProgress sx={{ color: "white" }} />
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

  return (
    <div>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "20px",
          backgroundColor: "white",
          minHeight: "100vh",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: "800px",
            padding: "30px",
            border: "2px solid black",
            borderRadius: "10px",
          }}
        >
          <Typography
            variant="h4"
            textAlign="center"
            sx={{ fontWeight: "bold", marginBottom: "20px" }}
          >
            Document Details
          </Typography>
          <Divider sx={{ marginBottom: "20px" }} />
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
            <strong>Credential ID:</strong> {document.credentialID}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Credential Type:</strong> {document.credentialType}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Grade:</strong> {document.grade}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Public Key:</strong> {document.publicKey}
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
                  backgroundColor: "black",
                  color: "white",
                  borderRadius: "10px",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "black",
                    border: "2px solid black",
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
                backgroundColor: "black",
                color: "white",
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: "white",
                  color: "black",
                  border: "2px solid black",
                },
              }}
            >
              {generating ? "Generating IPFS..." : "Generate IPFS"}
            </Button>
          )}
        </Paper>
        <Box
          sx={{
            width: "100%",
            maxWidth: "800px",
            marginTop: "20px",
          }}
        >
          {renderFilePreview()}
        </Box>
      </Box>
    </div>
  );
};

export default DocumentDetailPage;
