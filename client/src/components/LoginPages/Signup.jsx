import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  AppBar,
  Toolbar,
  MenuItem,
} from "@mui/material";

const Signup = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    university: "",
    userType: "",
    publicKey: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      id,
      name,
      email,
      university,
      userType,
      publicKey,
      password,
      confirmPassword,
    } = formData;

    if (
      !id ||
      !name ||
      !email ||
      !university ||
      !userType ||
      !publicKey ||
      !password ||
      !confirmPassword
    ) {
      setError("All fields are required.");
      return;
    }

    if (isNaN(parseInt(id, 10))) {
      setError("ID must be a valid integer.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("User signed up successfully!");
        navigate("/login");
      } else {
        const { error } = await response.json();
        setError(error || "Failed to sign up. Please try again.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    }
  };

  return (
    <Box
      sx={{
        fontFamily: "Poppins, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "white",
      }}
    >
      <AppBar
        position="static"
        sx={{
          backgroundColor: "black",
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              textAlign: "center",
              fontSize: "1.5rem",
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
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "450px",
            padding: "40px",
            backgroundColor: "#f9f9f9", // Off-white background
            borderRadius: "10px",
            border: "1px solid #e0e0e0",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            textAlign="center"
            sx={{
              fontWeight: "bold",
              color: "black",
              fontSize: "1.8rem",
              marginBottom: "20px",
            }}
          >
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit}>
            {error && (
              <Typography
                variant="body2"
                color="error"
                sx={{ marginBottom: "15px", fontSize: "0.9rem" }}
              >
                {error}
              </Typography>
            )}
            <TextField
              label="ID"
              name="id"
              value={formData.id}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
            <TextField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
            <TextField
              label="University"
              name="university"
              value={formData.university}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
            <TextField
              select
              label="User Type"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            >
              <MenuItem value="Issuer">Issuer</MenuItem>
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="HEI">HEI</MenuItem>
            </TextField>
            <TextField
              label="Public Key"
              name="publicKey"
              value={formData.publicKey}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
            <TextField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                marginTop: "20px",
                padding: "10px",
                backgroundColor: "black",
                color: "white",
                fontWeight: "bold",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "white",
                  color: "black",
                  border: "2px solid black",
                },
              }}
            >
              Sign Up
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default Signup;
