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
  Divider,
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
          padding: "20px",
          backgroundColor: "white",
          minHeight: "100vh",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: "40px",
            maxWidth: "700px",
            width: "100%",
            borderRadius: "10px",
            border: "2px solid black",
            marginTop: "20px", // Moved closer to the top
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            textAlign="center"
            sx={{ fontWeight: "bold", color: "black" }}
          >
            Documents List
          </Typography>
          <Divider sx={{ marginY: "20px", backgroundColor: "black" }} />
          <List>
            {documents.map((doc) => (
              <ListItem
                key={doc._id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                  border: "1px solid black",
                  borderRadius: "10px",
                  padding: "10px",
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: "bold", color: "black" }}
                    >
                      {doc.name} - {doc.course} - {doc.institution}
                    </Typography>
                  }
                />
                <Button
                  variant="contained"
                  component={Link}
                  to={`/document/${doc._id}`}
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                    borderRadius: "10px",
                    "&:hover": {
                      backgroundColor: "white",
                      color: "black",
                      border: "2px solid black",
                    },
                  }}
                >
                  View Details
                </Button>
              </ListItem>
            ))}
            {documents.length === 0 && (
              <Typography
                variant="body1"
                sx={{ textAlign: "center", color: "gray", marginTop: "20px" }}
              >
                No documents available at the moment.
              </Typography>
            )}
          </List>
        </Paper>
      </Box>
    </div>
  );
};

export default DocumentsListPage;
