import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { UserContext } from "../contexts/UserContext";
import Navbar from "./NavbarStudent";
import axios from "axios";

const ExemptionStatusPage = () => {
  const { user } = useContext(UserContext); // Retrieve the user's publicKey
  const [exemptionRequests, setExemptionRequests] = useState([]);

  useEffect(() => {
    const fetchExemptionRequests = async () => {
      if (user?.publicKey) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/exemption-requests`
          );
          const userRequests = response.data.filter(
            (request) => request.studentPublicKey === user.publicKey
          );
          setExemptionRequests(userRequests);
        } catch (error) {
          console.error("Error fetching exemption requests:", error);
        }
      }
    };

    fetchExemptionRequests();
  }, [user]);

  return (
    <div>
      <Navbar />
      <Box
        sx={{
          fontFamily: "Poppins, sans-serif",
          backgroundColor: "white",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          sx={{
            fontWeight: "bold",
            marginBottom: "20px",
            color: "black",
            fontSize: "28px",
          }}
        >
          Exemption Status
        </Typography>

        <Paper
          elevation={3}
          sx={{
            padding: "30px",
            maxWidth: "900px",
            margin: "0 auto",
            border: "2px solid black",
            borderRadius: "10px",
          }}
        >
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Course Title
                  </TableCell>

                  <TableCell sx={{ fontWeight: "bold" }}>Token IDs</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exemptionRequests.length > 0 ? (
                  exemptionRequests.map((request, index) => (
                    <TableRow key={index}>
                      <TableCell>{request.course}</TableCell>

                      <TableCell>
                        {request.tokenIds?.join(", ") || "N/A"}
                      </TableCell>
                      <TableCell>{request.status}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No exemption requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </div>
  );
};

export default ExemptionStatusPage;
