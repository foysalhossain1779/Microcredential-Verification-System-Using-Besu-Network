// Import dependencies
const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs"); // For file handling
const { create } = require("ipfs-http-client"); // IPFS client

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());
// Serve static files from the 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/documents", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Document Schema
const DocumentSchema = new mongoose.Schema({
  name: String,
  course: String,
  institution: String,
  filename: String,
  filepath: String,
  mimetype: String,
  size: Number,
  uploadDate: { type: Date, default: Date.now },
  ipfsCID: String, // IPFS CID
});
const Document = mongoose.model("Document", DocumentSchema);

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to store files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Invalid file type"));
    } else {
      cb(null, true);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

// Initialize IPFS client
const ipfsClient = create({ host: "127.0.0.1", port: 5001, protocol: "http" });

// File Upload Endpoint
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const { name, course, institution } = req.body;
    const { originalname, mimetype, size, path: filepath } = req.file;

    const document = new Document({
      name,
      course,
      institution,
      filename: originalname,
      filepath,
      mimetype,
      size,
    });

    await document.save();
    res.status(200).json({ message: "File uploaded successfully", document });
  } catch (err) {
    console.error("Error saving file:", err.message);
    res.status(500).json({ message: "Failed to upload file" });
  }
});

// IPFS Upload Endpoint
app.post("/api/upload-to-ipfs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the document by ID
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Validate file existence
    if (!fs.existsSync(document.filepath)) {
      return res.status(404).json({ message: "File not found on the server" });
    }

    // Read the file from the filepath
    const fileBuffer = fs.readFileSync(path.resolve(document.filepath));

    // Upload the file to IPFS
    const { cid } = await ipfsClient.add(fileBuffer);

    // Update the document with the CID
    document.ipfsCID = cid.toString();
    await document.save();

    res
      .status(200)
      .json({ message: "File uploaded to IPFS", cid: cid.toString() });
  } catch (err) {
    console.error("Error uploading file to IPFS:", err.message);
    res.status(500).json({ message: "Failed to upload to IPFS" });
  }
});

// Get All Documents
app.get("/api/documents", async (req, res) => {
  try {
    const documents = await Document.find();
    res.status(200).json(documents);
  } catch (err) {
    console.error("Error fetching documents:", err.message);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
});

// Get Single Document by ID
app.get("/api/documents/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json(document);
  } catch (err) {
    console.error("Error fetching document:", err.message);
    res.status(500).json({ message: "Failed to fetch document" });
  }
});

// Start Server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
