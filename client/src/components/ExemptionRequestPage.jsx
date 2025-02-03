import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import Navbar from "./NavbarStudent";

const ExemptionRequestPage = () => {
  const { user } = useContext(UserContext); // Access user context
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [tokenIds, setTokenIds] = useState([""]);
  const [userTokens, setUserTokens] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch courses and user tokens on component load
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
            `http://localhost:5000/api/tokens?publicKey=${user.publicKey}`
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
        studentName: user.name, // Dynamically set student name from context
        studentPublicKey: user.publicKey, // Dynamically set publicKey
        course: selectedCourse,
        tokenIds,
      };

      const response = await axios.post(
        "http://localhost:5000/api/exemption-requests",
        exemptionRequest
      );
      setMessage(response.data.message || "Request submitted successfully!");
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
          Exemption Request Portal
        </Typography>

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
            Submit Exemption Request
          </Typography>
          <TextField
            select
            label="Course"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            fullWidth
            required
            sx={{ marginBottom: "15px" }}
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
                marginBottom: "15px",
              }}
            >
              <TextField
                select
                label={`Token ID ${index + 1}`}
                value={value}
                onChange={(e) => handleTokenChange(index, e.target.value)}
                fullWidth
                required
                sx={{ marginRight: "10px" }}
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
              onClick={handleAddToken}
              startIcon={<AddCircleOutlineIcon />}
            >
              Add Token
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmitRequest}
              sx={{
                backgroundColor: "#1976d2",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
            >
              Submit Request
            </Button>
          </Box>
          {message && (
            <Typography
              sx={{
                color: message.includes("Failed") ? "red" : "green",
                marginTop: "20px",
              }}
            >
              {message}
            </Typography>
          )}
        </Paper>
      </Box>
    </div>
  );
};

export default ExemptionRequestPage;
