import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import axios from "axios";

const DocumentUpload = () => {
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    institution: "",
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

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
    data.append("name", formData.name);
    data.append("course", formData.course);
    data.append("institution", formData.institution);
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
  };

  return (
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
  );
};

export default DocumentUpload;
