import React, { useState, useContext, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import Navbar from "./NavbarStudent";
import { UserContext } from "../contexts/UserContext";

const DocumentUpload = () => {
  const { user } = useContext(UserContext); // Ensure we get the user context
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    institution: "",
    credentialID: "",
    // credentialTitle: "",
    credentialType: "",
    publicKey: "",
    grade: "",
    issueDate: "",
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  // Update the publicKey dynamically when the user context changes
  useEffect(() => {
    if (user && user.publicKey) {
      setFormData((prev) => ({
        ...prev,
        publicKey: user.publicKey,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please upload a document.");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    data.append("file", file);

    try {
      setMessage("Uploading...");
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(`Upload successful: ${response.data.message}`);
    } catch (error) {
      console.error("Error uploading document:", error);
      setMessage("Upload failed. Please try again.");
    }

    // Reset form data after submission
    setFormData({
      name: "",
      course: "",
      institution: "",
      credentialID: "",
      // credentialTitle: "",
      credentialType: "",
      publicKey: user?.publicKey || "",
      grade: "",
      issueDate: "",
    });
    setFile(null);
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
            Upload Document
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Credential Title"
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
              label="Credential ID"
              name="credentialID"
              value={formData.credentialID}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            {/* <TextField
              label="Credential Title"
              name="credentialTitle"
              value={formData.credentialTitle}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            /> */}
            <TextField
              select
              label="Credential Type"
              name="credentialType"
              value={formData.credentialType}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            >
              <MenuItem value="Academic Credential">
                Academic Credential
              </MenuItem>
              <MenuItem value="Micro-Credential">Micro-Credential</MenuItem>
            </TextField>
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
              label="Issue Date"
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              type="file"
              onChange={handleFileChange}
              fullWidth
              required
              margin="normal"
              inputProps={{
                accept: "application/pdf, application/msword, image/*",
              }}
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
              Upload
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

export default DocumentUpload;
