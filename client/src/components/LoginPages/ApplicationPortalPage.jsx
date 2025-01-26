import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Paper,
} from "@mui/material";

const ApplicationPortalPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const certificate = location.state?.certificate || { title: "Unknown" };
  const user = location.state?.user || {}; // Retrieve user details

  const [formData, setFormData] = useState({
    name: user.name || "",
    id: user.id || "",
    email: user.email || "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);
  };

  const handleProfileClick = () => {
    navigate("/dashboard", { state: user });
  };

  return (
    <Box
      sx={{
        backgroundColor: "#D7F2BA", // Tea Green
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: "#676F54" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dr. FANS
          </Typography>
          <Button
            color="inherit"
            onClick={handleProfileClick}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            My Profile
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          flexGrow: 1,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: "30px",
            width: "100%",
            maxWidth: "500px",
            backgroundColor: "#BDE4A8", // Celadon
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            textAlign="center"
            sx={{ color: "#676F54" }}
          >
            Application Portal
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            gutterBottom
            sx={{ color: "#676F54" }}
          >
            Applying for: <strong>{certificate.title}</strong>
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#676F54" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#79B4A9", // Cambridge Blue
                  },
                  "&:hover fieldset": {
                    borderColor: "#676F54", // Reseda Green
                  },
                },
              }}
            />
            <TextField
              label="ID"
              name="id"
              value={formData.id}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              variant="outlined"
            />
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{
                marginTop: "15px",
                backgroundColor: "#79B4A9",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#676F54",
                },
              }}
            >
              Upload Document
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                marginTop: "20px",
                backgroundColor: "#676F54", // Reseda Green
                "&:hover": {
                  backgroundColor: "#9CC69B", // Celadon
                },
              }}
            >
              Submit
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default ApplicationPortalPage;
