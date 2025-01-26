import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  AppBar,
  Toolbar,
} from "@mui/material";
import { UserContext } from "../../contexts/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loginUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        loginUser(data.user);

        alert("Login successful!");
        console.log(data);
        // Navigate based on userType
        if (data.user.userType === "Student") {
          navigate("/dashboard");
        } else if (data.user.userType === "Issuer") {
          navigate("/admin-dashboard");
        } else {
          setError("Unknown user type.");
        }
      } else {
        const { error } = await response.json();
        setError(error || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to connect to the server. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#D7F2BA", // Tea Green
      }}
    >
      <AppBar position="fixed" sx={{ backgroundColor: "#676F54" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dr. FANS
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{ marginTop: "100px", display: "flex", justifyContent: "center" }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "600px", // Increased the width
            padding: "40px", // Increased padding
            backgroundColor: "#BDE4A8", // Celadon
            borderRadius: "10px",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            textAlign="center"
            sx={{ fontWeight: "bold", color: "#676F54", fontSize: "2rem" }} // Increased font size
          >
            Welcome to Dr. FANS
          </Typography>
          <Typography
            variant="subtitle1"
            textAlign="center"
            sx={{ marginBottom: "25px", color: "#79B4A9", fontSize: "1.2rem" }} // Adjusted font size
          >
            Your Next Step to Modern Credentialing
          </Typography>
          <form onSubmit={handleLogin}>
            {error && (
              <Typography
                variant="body2"
                color="error"
                sx={{ marginBottom: "20px", fontSize: "1rem" }}
              >
                {error}
              </Typography>
            )}
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              margin="normal"
              sx={{ fontSize: "1rem" }}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              margin="normal"
              sx={{ fontSize: "1rem" }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                marginTop: "30px",
                padding: "15px", // Increased button padding
                backgroundColor: "#676F54", // Reseda Green
                color: "#fff",
                fontSize: "1rem", // Increased button font size
                "&:hover": {
                  backgroundColor: "#79B4A9", // Cambridge Blue
                },
              }}
            >
              Sign In
            </Button>
          </form>
          <Typography
            variant="body2"
            textAlign="center"
            sx={{ marginTop: "20px", fontSize: "1rem" }}
          >
            Not a user?{" "}
            <Link
              to="/signup"
              style={{
                color: "#79B4A9",
                textDecoration: "none",
              }}
            >
              Please sign up.
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
