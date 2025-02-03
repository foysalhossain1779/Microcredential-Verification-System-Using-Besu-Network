import React from "react";
import { useNavigate } from "react-router-dom";
import { useMetaMask } from "./contexts/MetaMaskContext";
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  CircularProgress,
} from "@mui/material";

function Home() {
  const { account } = useMetaMask; // Ensure this function is invoked properly if needed.
  const navigate = useNavigate();

  const handleIssueCertificate = () => {
    navigate("/login");
  };

  return (
    <div>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#000000",
          padding: "10px 20px",
        }}
      >
        <Toolbar>
          <Typography
            variant="h4"
            sx={{
              flexGrow: 1,
              fontFamily: "Poppins, sans-serif",
              fontWeight: "bold",
              color: "#FFFFFF",
            }}
          >
            Dr. FANS
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          padding: "40px 20px",
          textAlign: "center",
          fontFamily: "Poppins, sans-serif",
          backgroundColor: "#F9F9F9",
          minHeight: "100vh",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            color: "#000000",
            marginBottom: "20px",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Welcome to Dr. FANS
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontSize: "1.5rem",
            color: "#444444",
            fontFamily: "Poppins, sans-serif",
            marginBottom: "40px",
          }}
        >
          Your all-in-one credentialing solution
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "30px",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleIssueCertificate}
            sx={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              padding: "15px 30px",
              color: "#FFFFFF",
              backgroundColor: "#000000",
              border: "2px solid #FFFFFF",
              "&:hover": {
                backgroundColor: "#333333",
              },
              width: "250px",
              borderRadius: "30px",
            }}
          >
            Login
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate("/signup")}
            sx={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              padding: "15px 30px",
              color: "#FFFFFF",
              backgroundColor: "#000000",
              border: "2px solid #FFFFFF",
              "&:hover": {
                backgroundColor: "#333333",
              },
              width: "250px",
              borderRadius: "30px",
            }}
          >
            Signup
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default Home;
