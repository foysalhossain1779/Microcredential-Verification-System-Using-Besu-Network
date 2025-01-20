// Import dependencies
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";

import Navbar from "./Navbar";

const DocumentsListPage = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/documents")
      .then((response) => setDocuments(response.data))
      .catch((error) => console.error("Error fetching documents:", error));
  }, []);

  return (
    <div>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          backgroundColor: "#D7F2BA", // Tea Green
          minHeight: "100vh",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: "30px",
            maxWidth: "600px",
            width: "100%",
            backgroundColor: "#BDE4A8", // Celadon
          }}
        >
          <Typography variant="h4" gutterBottom textAlign="center">
            Documents List
          </Typography>
          <List>
            {documents.map((doc) => (
              <ListItem key={doc._id} sx={{ marginBottom: "10px" }}>
                <ListItemText
                  primary={
                    <Typography variant="body1" color="textPrimary">
                      {doc.name} - {doc.course} - {doc.institution}
                    </Typography>
                  }
                />
                <Button
                  variant="contained"
                  component={Link}
                  to={`/document/${doc._id}`}
                  sx={{
                    backgroundColor: "#79B4A9", // Cambridge Blue
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#676F54", // Reseda Green
                    },
                  }}
                >
                  View Details
                </Button>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </div>
  );
};

export default DocumentsListPage;
