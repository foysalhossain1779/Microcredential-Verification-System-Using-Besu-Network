import React, { useState, useContext, useEffect } from "react";
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
import { UserContext } from "../contexts/UserContext";
import Navbar from "./NavbarStudent";

const ExemptionRequestPage = () => {
  const { user } = useContext(UserContext);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [tokenIds, setTokenIds] = useState([""]);
  const [userTokens, setUserTokens] = useState([]);
  const [message, setMessage] = useState("");
  const [exemptionRequirements, setExemptionRequirements] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/exemption-requirements"
        );
        const coursesList = response.data.map((req) => req.course);
        setCourses(coursesList);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    const fetchUserTokens = async () => {
      if (user?.publicKey) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/tokens/recipient?publicKey=${user.publicKey}`
          );
          setUserTokens(response.data);
        } catch (error) {
          console.error("Error fetching user tokens:", error);
        }
      }
    };

    fetchCourses();
    fetchUserTokens();
  }, [user]);

  useEffect(() => {
    const fetchExemptionRequirements = async () => {
      if (selectedCourse) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/exemption-requirements?course=${selectedCourse}`
          );
          setExemptionRequirements(response.data);
        } catch (error) {
          console.error("Error fetching exemption requirements:", error);
        }
      }
    };

    fetchExemptionRequirements();
  }, [selectedCourse]);

  const handleAddToken = () => {
    setTokenIds([...tokenIds, ""]);
  };

  const handleRemoveToken = (index) => {
    const updatedTokenIds = tokenIds.filter((_, i) => i !== index);
    setTokenIds(updatedTokenIds);
  };

  const handleTokenChange = (index, value) => {
    const updatedTokenIds = [...tokenIds];
    updatedTokenIds[index] = value;
    setTokenIds(updatedTokenIds);
  };

  const handleSubmitRequest = async () => {
    try {
      if (!selectedCourse || tokenIds.some((id) => id.trim() === "")) {
        setMessage("Please fill in all required fields.");
        return;
      }

      const exemptionRequest = {
        studentName: user.name,
        studentPublicKey: user.publicKey,
        course: selectedCourse,
        tokenIds,
      };

      const response = await axios.post(
        "http://localhost:5000/api/exemption-requests",
        exemptionRequest
      );
      alert("Request Submitted Successfully!");
      setMessage(response.data.message || "Request submitted successfully!");

      // Clear all fields
      setSelectedCourse("");
      setTokenIds([""]);
      setMessage("");
    } catch (error) {
      console.error("Error submitting request:", error);
      setMessage("Failed to submit the request.");
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
          padding: "20px",
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          sx={{
            fontWeight: "bold",
            marginBottom: "20px",
            color: "black",
            fontSize: "28px",
          }}
        >
          Exemption Request Portal
        </Typography>

        <Paper
          elevation={3}
          sx={{
            padding: "30px",
            maxWidth: "800px",
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
            Submit Exemption Request
          </Typography>
          <TextField
            select
            label="Select Course"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            fullWidth
            required
            sx={{
              marginBottom: "20px",
              "& .MuiInputBase-root": {
                borderRadius: "10px",
              },
            }}
          >
            {courses.map((course, index) => (
              <MenuItem key={index} value={course}>
                {course}
              </MenuItem>
            ))}
          </TextField>

          {tokenIds.map((value, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <TextField
                select
                label={`Token ID ${index + 1}`}
                value={value}
                onChange={(e) => handleTokenChange(index, e.target.value)}
                fullWidth
                required
                sx={{
                  marginRight: "10px",
                  "& .MuiInputBase-root": {
                    borderRadius: "10px",
                  },
                }}
              >
                {userTokens.map((token, idx) => (
                  <MenuItem key={idx} value={token.tokenId}>
                    {token.tokenId} - {token.credentialTitle}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                color="error"
                onClick={() => handleRemoveToken(index)}
                startIcon={<RemoveCircleOutlineIcon />}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#ffcccc",
                  },
                }}
              >
                Remove
              </Button>
            </Box>
          ))}

          <Box sx={{ marginTop: "30px" }}>
            {selectedCourse && exemptionRequirements.length > 0 && (
              <>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", marginBottom: "10px" }}
                >
                  Exemption Requirements for {selectedCourse}
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Credential
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Institution
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Course URL
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {exemptionRequirements
                        .filter(
                          (requirement) => requirement.course === selectedCourse
                        ) // Filter for the selected course
                        .flatMap((requirement) =>
                          requirement.microCredentials
                            .filter(
                              (credential) =>
                                credential.credential &&
                                credential.institution &&
                                credential.courseUrl
                            ) // Ensure valid credentials
                            .map((credential, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{credential.credential}</TableCell>
                                <TableCell>{credential.institution}</TableCell>
                                <TableCell>
                                  <a
                                    href={credential.courseUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    View Course
                                  </a>
                                </TableCell>
                              </TableRow>
                            ))
                        )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "30px",
            }}
          >
            <Button
              variant="outlined"
              onClick={handleAddToken}
              startIcon={<AddCircleOutlineIcon />}
            >
              Add Token
            </Button>
            <Button variant="contained" onClick={handleSubmitRequest}>
              Submit Request
            </Button>
          </Box>
        </Paper>
      </Box>
    </div>
  );
};

export default ExemptionRequestPage;
