import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [account, setAccount] = useState(null);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  //Function to connect to wallet

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
        backgroundColor: "#79B4A9", // Cambridge Blue
        color: "#FFFFFF", // White text
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, color: "#D7F2BA" }} // Tea Green for text
        >
          Dr. FANS
        </Typography>
        <Button
          onClick={() => navigate("/dashboard")}
          color="inherit"
          sx={{ color: "#BDE4A8" }}
        >
          Home
        </Button>
        <Button
          onClick={() => navigate("*")}
          color="inherit"
          sx={{ color: "#BDE4A8" }}
        >
          Request Course Exemption
        </Button>
        <Button
          onClick={() => navigate("/verify")}
          color="inherit"
          sx={{ color: "#BDE4A8" }}
        >
          Get Token Information
        </Button>
        <Button
          variant="contained"
          onClick={connectWallet}
          sx={{
            marginLeft: "20px",
            backgroundColor: account ? "#9CC69B" : "#676F54", // Different color if connected
            "&:hover": {
              backgroundColor: "#79B4A9",
            },
          }}
        >
          {account ? "Connected" : "Connect"}
        </Button>
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
          sx={{ width: "100%" }}
        >
          MetaMask connected successfully to {account}.
        </Alert>
      </Snackbar>
    </AppBar>
  );
};

export default Navbar;
