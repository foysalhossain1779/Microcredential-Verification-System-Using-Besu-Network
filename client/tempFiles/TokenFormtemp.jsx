// src/components/TokenForm.jsx
import React, { useState } from "react";

const TokenForm = ({ contract }) => {
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    institution: "",
    ipfsId: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract) {
      setMessage("Contract is not loaded yet.");
      return;
    }

    try {
      setMessage("Issuing token...");
      const tx = await contract.issueToken(
        formData.name,
        formData.course,
        formData.institution,
        parseInt(formData.ipfsId)
      );
      await tx.wait();
      setMessage("Token issued successfully!");
    } catch (error) {
      console.error("Error issuing token:", error);
      setMessage("Failed to issue token.");
    }
  };

  return (
    <div>
      <h2>Issue Token</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Student Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Course:</label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Institution:</label>
          <input
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>IPFS ID:</label>
          <input
            type="number"
            name="ipfsId"
            value={formData.ipfsId}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Issue Token</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default TokenForm;
