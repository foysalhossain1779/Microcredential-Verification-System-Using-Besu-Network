import React, { useState, useContext, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  MenuItem,
  Grid,
} from "@mui/material";
import axios from "axios";
import Navbar from "./NavbarStudent";
import { UserContext } from "../contexts/UserContext";

const DocumentUpload = () => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    institution: "",
    credentialID: "",
    credentialType: "",
    publicKey: "",
    grade: "",
    issueDate: "",
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

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
      setMessage({ text: "Please upload a document.", type: "error" });
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    data.append("file", file);

    try {
      setMessage({ text: "Uploading...", type: "info" });
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage({
        text: `Upload successful: ${response.data.message}`,
        type: "success",
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      setMessage({ text: "Upload failed. Please try again.", type: "error" });
    }

    setFormData({
      name: "",
      course: "",
      institution: "",
      credentialID: "",
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
            Upload Document
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Credential Title"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Credential ID"
                  name="credentialID"
                  value={formData.credentialID}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Credential Type"
                  name="credentialType"
                  value={formData.credentialType}
                  onChange={handleChange}
                  fullWidth
                  required
                >
                  <MenuItem value="Academic Credential">
                    Academic Credential
                  </MenuItem>
                  <MenuItem value="Micro-Credential">Micro-Credential</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Issue Date"
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="file"
                  onChange={handleFileChange}
                  fullWidth
                  required
                  inputProps={{
                    accept: "application/pdf, application/msword, image/*",
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
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
              fullWidth
            >
              Upload
            </Button>
          </form>
          {message && (
            <Typography
              variant="body1"
              sx={{
                marginTop: "20px",
                color:
                  message.type === "success"
                    ? "green"
                    : message.type === "error"
                    ? "red"
                    : "black",
              }}
            >
              {message.text}
            </Typography>
          )}
        </Paper>
      </Box>
    </div>
  );
};

export default DocumentUpload;
