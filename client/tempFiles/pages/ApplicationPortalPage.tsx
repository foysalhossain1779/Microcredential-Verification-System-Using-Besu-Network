import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ApplicationPortalPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const certificate = location.state?.certificate || { title: "Unknown" };
  const user = location.state?.user || {}; // Retrieve user details

  const [formData, setFormData] = useState({
    name: user.name || "",
    id: user.id || "",
    email: user.email || "",
    file: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);
  };

  const handleProfileClick = () => {
    // Navigate back to the DashboardPage with correct user data
    navigate("/dashboard", { state: user });
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        Dr. FANS
        <span style={styles.profileLink} onClick={handleProfileClick}>
          My Profile
        </span>
      </header>
      <main style={styles.main}>
        <h1 style={styles.title}>Application Portal</h1>
        <p style={styles.subtitle}>
          Applying for: <strong>{certificate.title}</strong>
        </p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="name" style={styles.label}>Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="id" style={styles.label}>ID</label>
            <input
              type="text"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="file" style={styles.label}>Upload Documents</label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
              style={styles.inputFile}
            />
          </div>
          <button type="submit" style={styles.button}>Submit</button>
        </form>
      </main>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  header: {
    backgroundColor: "#333",
    color: "white",
    padding: "10px 20px",
    fontSize: "24px",
    textAlign: "left",
    display: "flex",
    justifyContent: "space-between",
  },
  profileLink: {
    fontSize: "16px",
    color: "white",
    cursor: "pointer",
    alignSelf: "center",
  },
  main: {
    padding: "20px",
  },
  title: {
    fontSize: "28px",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "18px",
    marginBottom: "20px",
    color: "#666",
  },
  form: {
    display: "inline-block",
    textAlign: "left",
    maxWidth: "400px",
    width: "100%",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  inputFile: {
    padding: "5px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#333",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ApplicationPortalPage;
