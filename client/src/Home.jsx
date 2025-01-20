import React, { useContext } from "react";
import Navbar from "./components/Navbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useMetaMask } from "./contexts/MetaMaskContext";

function Home() {
  const { account } = useMetaMask;
  const navigate = useNavigate();

  const handleIssueCertificate = () => {
    navigate("/issue");
  };
  return (
    <div>
      <Navbar />
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
          Issue Certificate
        </Button>

        <Button
          variant="contained"
          onClick={() => navigate("/verify")}
          sx={{
            backgroundColor: "#9CC69B", // Celadon
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#79B4A9", // Cambridge Blue
            },
            width: "200px",
          }}
        >
          Verify Certificate
        </Button>
      </Box>
    </div>
  );
}

export default Home;
