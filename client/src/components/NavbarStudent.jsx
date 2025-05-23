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
        "Metamask is not installed. Please install it to use this application."
      );
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#000", // Black background
        boxShadow: "none",
        padding: "10px 20px",
      }}
    >
      <Toolbar>
        <Typography
          variant="h5"
          component="div"
          sx={{
            flexGrow: 1,
            color: "#fff", // White text
            fontFamily: "Poppins, sans-serif",
            fontWeight: "bold",
          }}
        >
          Dr. FANS
        </Typography>
        <Button
          onClick={() => navigate("/dashboard")}
          sx={{
            color: "#fff", // White text
            fontFamily: "Poppins, sans-serif",
            textTransform: "none",
            fontSize: "1rem",
            marginRight: "10px",
          }}
        >
          Home
        </Button>
        <Button
          onClick={() => navigate("/exempstat")}
          sx={{
            color: "#fff", // White text
            fontFamily: "Poppins, sans-serif",
            textTransform: "none",
            fontSize: "1rem",
            marginRight: "10px",
          }}
        >
          Show Exemption Status
        </Button>
        <Button
          onClick={() => navigate("/verify")}
          sx={{
            color: "#fff", // White text
            fontFamily: "Poppins, sans-serif",
            textTransform: "none",
            fontSize: "1rem",
            marginRight: "10px",
          }}
        >
          Get Token Information
        </Button>
        <Button
          variant="contained"
          onClick={connectWallet}
          sx={{
            marginLeft: "20px",
            backgroundColor: account ? "#444" : "#000", // Black or darker gray when connected
            color: "#fff",
            fontFamily: "Poppins, sans-serif",
            textTransform: "none",
            fontSize: "1rem",
            "&:hover": {
              backgroundColor: "#222", // Lighter black on hover
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
          sx={{
            width: "100%",
            fontFamily: "Poppins, sans-serif",
            fontSize: "0.9rem",
          }}
        >
          MetaMask connected successfully to {account}.
        </Alert>
      </Snackbar>
    </AppBar>
  );
};

export default Navbar;
