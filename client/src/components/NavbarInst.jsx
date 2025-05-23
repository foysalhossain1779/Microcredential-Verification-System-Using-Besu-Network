import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

const Navbar = () => {
  const [account, setAccount] = useState(null);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  // Function to connect to wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error connecting to Metamask: ", error);
      }
    } else {
      alert(
        "Metamask is not installed. Please install it to use this application"
      );
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "black", // Black background for AppBar
        color: "white", // White text
        boxShadow: "none",
        borderBottom: "2px solid black",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: "bold",
            cursor: "pointer",
            color: "white",
          }}
          onClick={() => navigate("/admin-dashboard")}
        >
          Dr. FANS
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Button
            onClick={() => navigate("/Inst-admin-dashboard")}
            sx={{
              color: "white",
              textTransform: "none",
              "&:hover": {
                color: "#f0f0f0",
              },
            }}
          >
            Home
          </Button>
          <Button
            onClick={() => navigate("/adminexemp")}
            sx={{
              color: "white",
              textTransform: "none",
              "&:hover": {
                color: "#f0f0f0",
              },
            }}
          >
            Create Exemption Forms
          </Button>
          <Button
            onClick={() => navigate("/adminrevexemp")}
            sx={{
              color: "white",
              textTransform: "none",
              "&:hover": {
                color: "#f0f0f0",
              },
            }}
          >
            Review Exemption Requests
          </Button>
          <Button
            variant="contained"
            onClick={connectWallet}
            sx={{
              backgroundColor: account ? "white" : "black",
              color: account ? "black" : "white",
              borderRadius: "20px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: account ? "#f0f0f0" : "white",
                color: account ? "black" : "black",
                border: "2px solid black",
              },
            }}
          >
            {account ? "Connected" : "Connect"}
          </Button>
        </Box>
      </Toolbar>
      {/* Snackbar for success message */}
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{
            width: "100%",
            backgroundColor: "black",
            color: "white",
          }}
        >
          MetaMask connected successfully to {account}.
        </Alert>
      </Snackbar>
    </AppBar>
  );
};

export default Navbar;
