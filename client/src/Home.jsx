import React, { useContext } from "react";
import Navbar from "./components/Navbar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useMetaMask } from "./contexts/MetaMaskContext";
import { Box, Typography, Button, AppBar, Toolbar } from "@mui/material";

function Home() {
  const { account } = useMetaMask;
  const navigate = useNavigate();

  const handleIssueCertificate = () => {
    navigate("/login");
  };
  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: "#676F54" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dr. FANS
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Welcome to Dr.FANS</h1>
        <p>Your all in one credentialing solution</p>
      </div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "50px",
          gap: "20px",
        }}
      >
        <Button
          variant="contained"
          onClick={handleIssueCertificate}
          sx={{
            backgroundColor: "#9CC69B", // Celadon
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#79B4A9", // Cambridge Blue
            },
            width: "200px",
          }}
        >
          Login
        </Button>

        <Button
          variant="contained"
          onClick={() => navigate("/signup")}
          sx={{
            backgroundColor: "#9CC69B", // Celadon
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#79B4A9", // Cambridge Blue
            },
            width: "200px",
          }}
        >
          Signup
        </Button>
      </Box>
    </div>
  );
}

export default Home;
