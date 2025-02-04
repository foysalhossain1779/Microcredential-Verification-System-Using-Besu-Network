// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const { create } = require("ipfs-http-client"); // IPFS client

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Serve static files from the 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connections
mongoose
  .connect("mongodb://localhost:27017/appDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Define Schemas and Models
// Document Schema
const DocumentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  course: { type: String, required: true },
  institution: { type: String, required: true },
  credentialID: { type: String, required: true },
  // credentialTitle: { type: String, required: true }, // New field
  credentialType: { type: String, required: true },
  grade: { type: String, required: true },
  publicKey: { type: String, required: true },
  issueDate: { type: String, required: true },
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
});
const Document = mongoose.model("Document", DocumentSchema);

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  university: { type: String, required: true },
  userType: {
    type: String,
    required: true,
    enum: ["Issuer", "Student", "HEI"],
  }, // Added userType with validation
  publicKey: { type: String, required: true }, // Added publicKey
  password: { type: String, required: true },
});

// Token Schema
const TokenSchema = new mongoose.Schema({
  tokenId: { type: String, required: true },
  credentialTitle: { type: String, required: true },
  recipientPublicKey: { type: String, required: true },
  issuerPublicKey: { type: String, required: true }, // New field
});

const Token = mongoose.model("Token", TokenSchema);

const User = mongoose.model("User", userSchema);

// Exemption Schemas
const ExemptionRequirementSchema = new mongoose.Schema({
  course: { type: String, required: true },
  microCredentials: [{ type: String, required: true }], // Array of required micro-credentials
  institution: { type: String, required: true },
  createdBy: { type: String, required: true }, // Public key of the institution
});
const ExemptionRequirement = mongoose.model(
  "ExemptionRequirement",
  ExemptionRequirementSchema
);

const ExemptionRequestSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentPublicKey: { type: String, required: true },
  course: { type: String, required: true },
  tokenIds: [{ type: String, required: true }], // Array of submitted token IDs
  status: { type: String, default: "Pending" }, // Pending, Approved, Rejected
});
const ExemptionRequest = mongoose.model(
  "ExemptionRequest",
  ExemptionRequestSchema
);

// API Endpoints

// Update Exemption Request Status
app.patch("/api/exemption-requests/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get the request ID
    const { status } = req.body; // Get the new status from the request body

    // Validate status
    if (!["Accepted", "Rejected", "Pending"].includes(status)) {
      return res
        .status(400)
        .json({ error: "Invalid status. Use Accepted, Rejected, or Pending." });
    }

    // Find the request by ID and update its status
    const updatedRequest = await ExemptionRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedRequest) {
      return res
        .status(404)
        .json({ error: "Exemption request not found with the provided ID." });
    }

    res.status(200).json({
      message: "Exemption request updated successfully.",
      updatedRequest,
    });
  } catch (error) {
    console.error("Error updating exemption request:", error.message);
    res.status(500).json({ error: "Failed to update exemption request." });
  }
});

// Save Exemption Requirement
app.post("/api/exemption-requirements", async (req, res) => {
  try {
    const { course, microCredentials, institution, createdBy } = req.body;

    if (!course || !microCredentials || !institution || !createdBy) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newRequirement = new ExemptionRequirement({
      course,
      microCredentials,
      institution,
      createdBy,
    });

    await newRequirement.save();
    res.status(201).json({
      message: "Exemption requirement saved successfully",
      newRequirement,
    });
  } catch (err) {
    console.error("Error saving exemption requirement:", err.message);
    res.status(500).json({ error: "Failed to save exemption requirement." });
  }
});

// Retrieve Exemption Requirements
app.get("/api/exemption-requirements", async (req, res) => {
  try {
    const requirements = await ExemptionRequirement.find();
    res.status(200).json(requirements);
  } catch (err) {
    console.error("Error fetching exemption requirements:", err.message);
    res.status(500).json({ error: "Failed to fetch exemption requirements." });
  }
});

// Submit Exemption Request
app.post("/api/exemption-requests", async (req, res) => {
  try {
    const { studentName, studentPublicKey, course, tokenIds } = req.body;

    if (
      !studentName ||
      !studentPublicKey ||
      !course ||
      !tokenIds ||
      tokenIds.length === 0
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newRequest = new ExemptionRequest({
      studentName,
      studentPublicKey,
      course,
      tokenIds,
    });

    await newRequest.save();
    res.status(201).json({
      message: "Exemption request submitted successfully",
      newRequest,
    });
  } catch (err) {
    console.error("Error submitting exemption request:", err.message);
    res.status(500).json({ error: "Failed to submit exemption request." });
  }
});

// Retrieve Exemption Requests for Review
app.get("/api/exemption-requests", async (req, res) => {
  try {
    const requests = await ExemptionRequest.find();
    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching exemption requests:", err.message);
    res.status(500).json({ error: "Failed to fetch exemption requests." });
  }
});

// Validate Tokens via Smart Contract
app.post("/api/validate-tokens", async (req, res) => {
  try {
    const { tokenIds } = req.body;

    if (!tokenIds || tokenIds.length === 0) {
      return res.status(400).json({ error: "Token IDs are required." });
    }

    const tokenDetails = [];
    for (const tokenId of tokenIds) {
      const token = await contract.getToken(tokenId); // Interact with the blockchain
      tokenDetails.push(token);
    }

    res
      .status(200)
      .json({ message: "Tokens validated successfully", tokenDetails });
  } catch (err) {
    console.error("Error validating tokens:", err.message);
    res.status(500).json({ error: "Failed to validate tokens." });
  }
});

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
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
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Initialize IPFS client
const ipfsClient = create({ host: "127.0.0.1", port: 5001, protocol: "http" });

// Routes

// Endpoint to check user type by email
app.get("/api/user-type", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    // Search the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Return the user type
    res.status(200).json({
      email: user.email,
      name: user.name,
      userType: user.userType,
    });
  } catch (err) {
    console.error("Error fetching user type:", err.message);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// File Upload Endpoint
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const {
      name,
      course,
      institution,
      credentialID,
      // credentialTitle,
      credentialType,
      publicKey,
      grade,
      issueDate,
    } = req.body;

    const { originalname, mimetype, size, path: filepath } = req.file;

    // Validate required fields
    if (
      !name ||
      !course ||
      !institution ||
      !credentialID ||
      // !credentialTitle ||
      !credentialType ||
      !publicKey ||
      !grade ||
      !issueDate ||
      !req.file
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Create a new document in MongoDB
    const document = new Document({
      name,
      course,
      institution,
      credentialID,
      // credentialTitle,
      credentialType,
      publicKey,
      grade,
      issueDate,
      filename: originalname,
      filepath,
      mimetype,
      size,
    });

    // Save the document to the database
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
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (!fs.existsSync(document.filepath)) {
      return res.status(404).json({ message: "File not found on the server" });
    }

    const fileBuffer = fs.readFileSync(path.resolve(document.filepath));
    const { cid } = await ipfsClient.add(fileBuffer);

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

// Delete Document by ID API

app.delete("/api/documents/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDocument = await Document.findByIdAndDelete(id);
    if (!deletedDocument) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error("Error deleting document:", err.message);
    res.status(500).json({ message: "Failed to delete document" });
  }
});

// Token Upload API
app.post("/api/tokens", async (req, res) => {
  try {
    const { tokenId, credentialTitle, recipientPublicKey, issuerPublicKey } =
      req.body;

    // Validate required fields
    if (
      !tokenId ||
      !credentialTitle ||
      !recipientPublicKey ||
      !issuerPublicKey
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newToken = new Token({
      tokenId,
      credentialTitle,
      recipientPublicKey,
      issuerPublicKey, // Save issuer public key
    });

    await newToken.save();

    res.status(201).json({ message: "Token saved successfully", newToken });
  } catch (err) {
    console.error("Error saving token:", err.message);
    res.status(500).json({ message: "Failed to save token" });
  }
});

// Get tokens issued by a specific issuer
app.get("/api/tokens", async (req, res) => {
  const { issuerPublicKey } = req.query;

  if (!issuerPublicKey) {
    return res.status(400).json({ message: "Issuer public key is required" });
  }

  try {
    const tokens = await Token.find({ issuerPublicKey });
    res.status(200).json(tokens);
  } catch (err) {
    console.error("Error fetching tokens:", err.message);
    res.status(500).json({ message: "Failed to fetch tokens" });
  }
});

//Get Token
app.get("/api/tokens/recipient", async (req, res) => {
  const { publicKey } = req.query;
  const tokens = await Token.find({ recipientPublicKey: publicKey });
  res.status(200).json(tokens);
});

// Signup Endpoint
app.post("/signup", async (req, res) => {
  try {
    const { name, id, email, university, userType, publicKey, password } =
      req.body;

    // Validate required fields
    if (
      !name ||
      !id ||
      !email ||
      !university ||
      !userType ||
      !publicKey ||
      !password
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if user already exists by email or ID
    if ((await User.findOne({ email })) || (await User.findOne({ id }))) {
      return res.status(400).json({ error: "User already registered." });
    }

    // Create new user and save to database
    const newUser = new User({
      name,
      id,
      email,
      university,
      userType,
      publicKey,
      password,
    });
    await newUser.save();

    res.status(201).json({ message: "User signed up successfully!" });
  } catch (err) {
    console.error("Error during signup:", err.message);
    res.status(500).json({ error: "Failed to save user data." });
  }
});

// Login Endpoint
const jwt = require("jsonwebtoken"); // Ensure this is installed using `npm install jsonwebtoken`

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email }, // Payload
      "your-secret-key", // Replace with a secure key in an environment variable
      { expiresIn: "1h" } // Token expiration
    );

    // Send the user data and token
    res.status(200).json({
      message: "Login successful!",
      token, // Include the token in the response
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        university: user.university,
        publicKey: user.publicKey,
      },
    });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ error: "Failed to log in." });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
