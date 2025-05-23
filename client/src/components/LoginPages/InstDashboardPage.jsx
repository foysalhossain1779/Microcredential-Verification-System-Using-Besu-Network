import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  CircularProgress,
} from "@mui/material";
import { UserContext } from "../../contexts/UserContext";
import Navbar from "../NavbarInst"; // Ensure there's a separate Navbar for Admin if required

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
          backgroundColor: "black",
          color: "white",
        }}
      >
        <CircularProgress sx={{ color: "white" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "white",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <Navbar />

      <Paper
        elevation={3}
        sx={{
          width: "90%",
          maxWidth: "800px",
          padding: "40px",
          borderRadius: "10px",
          border: "2px solid black",
          marginTop: "20px",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          textAlign="center"
          sx={{
            fontWeight: "bold",
            color: "black",
            fontSize: "32px",
          }}
        >
          Institution Profile
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              marginRight: "20px",
              backgroundColor: "black",
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            {user.name ? user.name[0] : "A"}
          </Avatar>
          <Box>
            <Typography
              variant="body1"
              sx={{ fontSize: "18px", marginBottom: "5px" }}
            >
              <strong>ID:</strong> {user.id || "No ID Provided"}
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: "18px", marginBottom: "5px" }}
            >
              <strong>Name:</strong> {user.name || "No Name Provided"}
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: "18px", marginBottom: "5px" }}
            >
              <strong>Email:</strong> {user.email || "No Email Provided"}
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: "18px", marginBottom: "5px" }}
            >
              <strong>Role:</strong> Admin
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            marginTop: "30px",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <Button
            variant="contained"
            onClick={handleReviewCertificates}
            sx={{
              backgroundColor: "black",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "10px",
              padding: "10px 20px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "white",
                color: "black",
                border: "2px solid black",
              },
            }}
          >
            Create Exemption Form
          </Button>
          <Button
            variant="contained"
            onClick={handleGetTokenInfo}
            sx={{
              backgroundColor: "black",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "10px",
              padding: "10px 20px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "white",
                color: "black",
                border: "2px solid black",
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
