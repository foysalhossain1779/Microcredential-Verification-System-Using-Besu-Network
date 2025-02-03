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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#FFFFFF", // White background
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: "#000" }}>
        <Toolbar>
          <Typography
            variant="h4"
            sx={{
              flexGrow: 1,
              fontFamily: "Poppins, sans-serif",
              fontWeight: "bold",
              color: "#FFF",
              textAlign: "center", // Centered text
            }}
          >
            Dr. FANS
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          marginTop: "50px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "500px",
            padding: "40px",
            backgroundColor: "#F8F8F8", // Off-white box color
            border: "1px solid #DDD", // Light gray border
            borderRadius: "10px",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            textAlign="center"
            sx={{
              fontWeight: "bold",
              fontSize: "2rem",
              color: "#000",
            }}
          >
            Welcome to Dr. FANS
          </Typography>
          <Typography
            variant="subtitle1"
            textAlign="center"
            sx={{
              marginBottom: "20px",
              color: "#555", // Dark gray text
              fontSize: "1.2rem",
            }}
          >
            Your Next Step to Modern Credentialing
          </Typography>
          <form onSubmit={handleLogin}>
            {error && (
              <Typography
                variant="body2"
                color="error"
                sx={{
                  marginBottom: "15px",
                  fontSize: "1rem",
                  textAlign: "center",
                }}
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
              sx={{
                backgroundColor: "#FFFFFF", // White background for input
                borderRadius: "5px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#AAA", // Light gray border
                  },
                  "&:hover fieldset": {
                    borderColor: "#555", // Darker gray on hover
                  },
                },
              }}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              margin="normal"
              sx={{
                backgroundColor: "#FFFFFF", // White background for input
                borderRadius: "5px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#AAA", // Light gray border
                  },
                  "&:hover fieldset": {
                    borderColor: "#555", // Darker gray on hover
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                marginTop: "30px",
                padding: "15px",
                backgroundColor: "#000",
                color: "#FFF",
                fontSize: "1.2rem",
                "&:hover": {
                  backgroundColor: "#333", // Slightly lighter black
                },
                borderRadius: "30px",
              }}
            >
              Sign In
            </Button>
          </form>
          <Typography
            variant="body2"
            textAlign="center"
            sx={{
              marginTop: "20px",
              fontSize: "1rem",
              color: "#555",
            }}
          >
            Not a user?{" "}
            <Link
              to="/signup"
              style={{
                color: "#000",
                fontWeight: "bold",
                textDecoration: "underline",
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
