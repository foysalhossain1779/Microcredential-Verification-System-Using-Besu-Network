import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import { UserContext } from "../../contexts/UserContext";
import axios from "axios";
import Navbar from "../NavbarStudent";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        if (!user || !user.publicKey) {
          console.error("User or public key not available.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/tokens/recipient?publicKey=${user.publicKey}`
        );
        setCertificates(response.data);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setTimeout(() => setLoading(false), 800);
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

  const handleExemption = () => {
    navigate("/reqexemp");
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
          fontFamily: "Poppins, sans-serif",
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        <CircularProgress sx={{ color: "white" }} />
      </Box>
    );
  }

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <Navbar />
      <Box
        sx={{
          backgroundColor: "white",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "90%",
            maxWidth: "800px",
            padding: "40px",
            backgroundColor: "white",
            borderRadius: "10px",
            border: "2px solid black",
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            textAlign="center"
            sx={{ fontWeight: "bold", color: "black" }}
          >
            My Profile
          </Typography>

          <Box
            sx={{ display: "flex", alignItems: "center", marginBottom: "30px" }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                marginRight: "20px",
                backgroundColor: "black",
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
            variant="h4"
            gutterBottom
            textAlign="center"
            sx={{ color: "black" }}
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
                      backgroundColor: "#f9f9f9",
                      color: "black",
                      border: "2px solid black",
                    }}
                  >
                    <Typography variant="h5" gutterBottom>
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
                        marginTop: "15px",
                        backgroundColor: "black",
                        color: "white",
                        border: "2px solid black",
                        borderRadius: "10px",
                        "&:hover": {
                          backgroundColor: "white",
                          color: "black",
                        },
                      }}
                    >
                      View
                    </Button>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Typography variant="body1" color="black" textAlign="center">
                No certificates available.
              </Typography>
            )}
          </Grid>

          <Box
            sx={{
              marginTop: "50px",
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "10px",
              border: "2px solid black",
              textAlign: "center",
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <Button
              variant="contained"
              onClick={handleCertificateRequest}
              sx={{
                backgroundColor: "black",
                color: "white",
                border: "2px solid black",
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: "white",
                  color: "black",
                },
              }}
            >
              Request to Store Academic Certificate
            </Button>
            <Button
              variant="contained"
              onClick={handleExemption}
              sx={{
                backgroundColor: "black",
                color: "white",
                border: "2px solid black",
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: "white",
                  color: "black",
                },
              }}
            >
              Request Exemption
            </Button>
          </Box>
        </Paper>
      </Box>
    </div>
  );
};

export default DashboardPage;
