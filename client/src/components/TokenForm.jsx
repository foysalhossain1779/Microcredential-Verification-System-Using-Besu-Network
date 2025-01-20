import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useMetaMask } from "../contexts/MetaMaskContext";
import Navbar from "./Navbar";

const TokenForm = () => {
  const { contract, account } = useMetaMask();

  // const location = useLocation();
  // const { contract, account } = location.state || {}; // Extract from navigation state

  const [formData, setFormData] = useState({
    name: "",
    course: "",
    institution: "",
    ipfsId: "",
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
        formData.name,
        formData.course,
        formData.institution,
        formData.ipfsId
      );
      await tx.wait();
      setMessage("Token issued successfully!");
    } catch (error) {
      console.error("Error issuing token:", error);
      setMessage("Failed to issue token.");
    }

    console.log("Form Data:", formData);
    setFormData({
      name: "",
      course: "",
      institution: "",
      ipfsId: "",
    });
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
            maxWidth: "500px",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Issue Token
          </Typography>
          <Typography variant="body1" gutterBottom>
            Connected Account: {account}
          </Typography>
          <form onSubmit={handleSubmit}>
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
              label="Course"
              name="course"
              value={formData.course}
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
              label="IPFS ID"
              name="ipfsId"
              value={formData.ipfsId}
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
              sx={{ color: "green", marginTop: "20px" }}
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
