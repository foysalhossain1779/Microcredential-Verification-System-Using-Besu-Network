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
  Grid,
  CircularProgress,
} from "@mui/material";
import { UserContext } from "../../contexts/UserContext";
import axios from "axios";
import Navbar from "../NavbarStudent";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // Access user from context
  const [certificates, setCertificates] = useState([]); // Dynamic certificates
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        if (!user || !user.publicKey) {
          console.error("User or public key not available.");
          setLoading(false);
          return;
        }

        // Fetch tokens using the user's public key
        const response = await axios.get(
          `http://localhost:5000/api/tokens?publicKey=${user.publicKey}`
        );
        setCertificates(response.data); // Set fetched tokens as certificates
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [user]);

  const handleView = (certificate) => {
    navigate("/application-portal", { state: { certificate } });
  };

  const handleCertificateRequest = () => {
    navigate("/DocUp", {
      state: { certificate: { title: "Academic Certificate Store" }, user },
    });
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
    <div>
      <Navbar />
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
            My Profile
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
                <strong>University:</strong>{" "}
                {user.university || "No University Provided"}
              </Typography>
              <Typography>
                <strong>Public Key:</strong>{" "}
                {user.publicKey || "No Public Key Provided"}
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="h5"
            gutterBottom
            textAlign="center"
            sx={{ color: "#676F54" }}
          >
            Certificates
          </Typography>

          <Grid container spacing={3}>
            {certificates.length > 0 ? (
              certificates.map((cert, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper
                    elevation={3}
                    sx={{
                      padding: "20px",
                      borderRadius: "10px",
                      backgroundColor: "#79B4A9", // Cambridge Blue
                      color: "#fff",
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {cert.credentialTitle}
                    </Typography>
                    <Typography>Token ID: {cert.tokenId}</Typography>
                    <Typography>
                      Credential Title: {cert.credentialTitle}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => handleView(cert)}
                      sx={{
                        marginTop: "10px",
                        backgroundColor: "#676F54", // Reseda Green
                        "&:hover": {
                          backgroundColor: "#9CC69B",
                        },
                      }}
                    >
                      View
                    </Button>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Typography
                variant="body1"
                color="textSecondary"
                textAlign="center"
              >
                No certificates available.
              </Typography>
            )}
          </Grid>

          <Box
            sx={{
              marginTop: "40px",
              padding: "20px",
              backgroundColor: "#BDE4A8", // Celadon
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Request to Store Academic Certificate
            </Typography>
            <Typography>
              Store your academic certificate on the blockchain for secure and
              verifiable credentials.
            </Typography>
            <Button
              variant="contained"
              onClick={handleCertificateRequest}
              sx={{
                marginTop: "20px",
                backgroundColor: "#676F54", // Reseda Green
                "&:hover": {
                  backgroundColor: "#79B4A9", // Cambridge Blue
                },
              }}
            >
              Request to Store Academic Certificate
            </Button>
          </Box>
        </Paper>
      </Box>
    </div>
  );
};

export default DashboardPage;
