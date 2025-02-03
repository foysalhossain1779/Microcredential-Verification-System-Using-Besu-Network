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
    userType: "", // New field for user type
    publicKey: "", // New field for public key
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

    const idInt = parseInt(id, 10);
    if (isNaN(idInt)) {
      setError("ID must be a valid integer.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(""); // Clear existing errors

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: idInt,
          name,
          email,
          university,
          userType,
          publicKey,
          password,
        }),
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
        sx={{
          marginTop: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "400px",
            padding: "30px",
            backgroundColor: "#BDE4A8", // Celadon
            borderRadius: "10px",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            textAlign="center"
            sx={{ fontWeight: "bold", color: "#676F54" }}
          >
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit}>
            {error && (
              <Typography
                variant="body2"
                color="error"
                sx={{ marginBottom: "15px" }}
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
            />
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
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
            />
            <TextField
              label="University"
              name="university"
              value={formData.university}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
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
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                marginTop: "20px",
                backgroundColor: "#676F54", // Reseda Green
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#79B4A9", // Cambridge Blue
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
