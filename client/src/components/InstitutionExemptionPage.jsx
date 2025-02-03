import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import axios from "axios";
import Navbar from "./Navbar";

const InstitutionExemptionPage = () => {
  const [course, setCourse] = useState("");
  const [microCredentials, setMicroCredentials] = useState([""]);
  const [exemptionRequests, setExemptionRequests] = useState([]);

  // Fetch exemption requests on load
  useEffect(() => {
    const fetchExemptionRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/exemption-requests"
        );
        setExemptionRequests(response.data);
      } catch (error) {
        console.error("Error fetching exemption requests:", error);
      }
    };

    fetchExemptionRequests();
  }, []);

  const handleAddMicroCredential = () => {
    setMicroCredentials([...microCredentials, ""]);
  };

  const handleRemoveMicroCredential = (index) => {
    const updatedMicroCredentials = microCredentials.filter(
      (_, i) => i !== index
    );
    setMicroCredentials(updatedMicroCredentials);
  };

  const handleMicroCredentialChange = (index, value) => {
    const updatedMicroCredentials = [...microCredentials];
    updatedMicroCredentials[index] = value;
    setMicroCredentials(updatedMicroCredentials);
  };

  const handlePostRequirement = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/exemption-requirements",
        {
          course,
          microCredentials,
          institution: "Your Institution Name", // Replace with dynamic value
          createdBy: "Your Public Key", // Replace with dynamic public key
        }
      );

      alert("Requirement posted successfully!");
      setCourse("");
      setMicroCredentials([""]);
    } catch (error) {
      console.error("Error posting requirement:", error);
      alert("Failed to post requirement.");
    }
  };

  return (
    <div>
      <Navbar />
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
          Institution Exemption Portal
        </Typography>

        {/* Post Exemption Requirement Section */}
        <Paper
          elevation={3}
          sx={{
            padding: "20px",
            marginBottom: "30px",
            backgroundColor: "#fff",
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", marginBottom: "20px" }}
          >
            Post Exemption Requirement
          </Typography>
          <TextField
            label="Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            fullWidth
            required
            sx={{ marginBottom: "15px" }}
          />
          {microCredentials.map((value, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <TextField
                label={`Micro-Credential ${index + 1}`}
                value={value}
                onChange={(e) =>
                  handleMicroCredentialChange(index, e.target.value)
                }
                fullWidth
                required
                sx={{ marginRight: "10px" }}
              />
              <Button
                color="error"
                onClick={() => handleRemoveMicroCredential(index)}
                startIcon={<RemoveCircleOutlineIcon />}
              >
                Remove
              </Button>
            </Box>
          ))}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <Button
              variant="outlined"
              onClick={handleAddMicroCredential}
              startIcon={<AddCircleOutlineIcon />}
            >
              Add Micro-Credential
            </Button>
            <Button
              variant="contained"
              onClick={handlePostRequirement}
              sx={{
                backgroundColor: "#1976d2",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
            >
              POST REQUIREMENT
            </Button>
          </Box>
        </Paper>

        {/* Review Exemption Requests Section */}
        <Paper elevation={3} sx={{ padding: "20px", backgroundColor: "#fff" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", marginBottom: "20px" }}
          >
            Review Exemption Requests
          </Typography>
          {exemptionRequests.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell>Token IDs</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {exemptionRequests.map((request, index) => (
                    <TableRow key={index}>
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
            <Typography>No requests to review yet.</Typography>
          )}
        </Paper>
      </Box>
    </div>
  );
};

export default InstitutionExemptionPage;
