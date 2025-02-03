import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  AppBar,
  Toolbar,
  CircularProgress,
} from "@mui/material";
import { UserContext } from "../../contexts/UserContext";
import Navbar from "../Navbar"; // Ensure there's a separate Navbar for Admin if required

const InstDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // Access user from context
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (!user) {
      console.error("No user data found.");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleReviewCertificates = () => {
    navigate("/adminexemp"); // Navigate to the certificate review page
  };

  const handleGetTokenInfo = () => {
    navigate("/adminrevexemp"); // Navigate to the token information page
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

  return (
    <Box
      sx={{
        backgroundColor: "#D7F2BA", // Tea Green
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0px",
      }}
    >
      <Navbar />

      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: "800px",
          padding: "30px",
          backgroundColor: "#BDE4A8", // Celadon
          marginTop: "20px",
          borderRadius: "10px",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          textAlign="center"
          sx={{ fontWeight: "bold", color: "#676F54" }}
        >
          Institution Profile
        </Typography>

        <Box
          sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              marginRight: "20px",
              backgroundColor: "#9CC69B",
            }}
          />
          <Box>
            <Typography>
              <strong>ID:</strong> {user.id || "No ID Provided"}
            </Typography>
            <Typography>
              <strong>Name:</strong> {user.name || "No Name Provided"}
            </Typography>
            <Typography>
              <strong>Email:</strong> {user.email || "No Email Provided"}
            </Typography>
            <Typography>
              <strong>Role:</strong> Admin
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "30px",
          }}
        >
          <Button
            variant="contained"
            onClick={handleReviewCertificates}
            sx={{
              backgroundColor: "#676F54", // Reseda Green
              color: "#fff",
              "&:hover": {
                backgroundColor: "#79B4A9", // Cambridge Blue
              },
            }}
          >
            Create Exemption Form
          </Button>
          <Button
            variant="contained"
            onClick={handleGetTokenInfo}
            sx={{
              backgroundColor: "#676F54", // Reseda Green
              color: "#fff",
              "&:hover": {
                backgroundColor: "#79B4A9", // Cambridge Blue
              },
            }}
          >
            Review Exemption Requests
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default InstDashboardPage;
