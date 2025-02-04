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
        if (data.user.userType === "Student") {
          navigate("/dashboard");
        } else if (data.user.userType === "Issuer") {
          navigate("/admin-dashboard");
        } else if (data.user.userType === "HEI") {
          navigate("/Inst-admin-dashboard");
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
    <Box sx={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          padding: "20px",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "600px",
            padding: "40px",
            backgroundColor: "#F9F9F9",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", fontSize: "2rem" }}
          >
            Welcome to Dr. FANS
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ marginBottom: "25px", fontSize: "1.2rem", color: "#555" }}
          >
            Your Next Step to Modern Credentialing
          </Typography>
          <form onSubmit={handleLogin}>
            {error && (
              <Typography
                variant="body2"
                color="error"
                sx={{ marginBottom: "20px" }}
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
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                marginTop: "30px",
                padding: "15px",
                backgroundColor: "#000",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              Sign In
            </Button>
          </form>
          <Typography
            variant="body2"
            sx={{ marginTop: "20px", fontSize: "1rem" }}
          >
            Not a user?{" "}
            <Link
              to="/signup"
              style={{
                color: "#000",
                textDecoration: "underline",
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
