import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Send the login request to the backend
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json(); // Parse JSON response
        console.log("Login Response:", data); // Log the data received from the backend
        alert("Login successful!");

        // Navigate to the dashboard with all user data
        navigate("/dashboard", {
          state: {
            id: data.id, // Include user ID from the backend
            name: data.name, // Include name from the backend
            email: data.email, // Include email from the backend
            university: data.university, // Include university from the backend
          },
        });
      } else {
        const { error } = await response.json();
        setError(error || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to connect to the server. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>Dr. FANS</header>
      <main style={styles.main}>
        <div style={styles.box}>
          <h1 style={styles.title}>Welcome to DR.FANS</h1>
          <p style={styles.subtitle}>Your Next Step to Modern Credentialing</p>
          <form style={styles.form} onSubmit={handleLogin}>
            {error && <p style={styles.error}>{error}</p>}
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" style={styles.button}>
              Sign In
            </button>
          </form>
          <a href="/signup" style={styles.signUpLink}>
            Not a user? Please sign up.
          </a>
        </div>
      </main>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f8f9fa",
  },
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#333",
    color: "white",
    padding: "10px 20px",
    fontSize: "24px",
    textAlign: "left",
    zIndex: 1000,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  main: {
    marginTop: "80px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "calc(100vh - 80px)",
  },
  box: {
    width: "400px",
    padding: "30px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    marginBottom: "10px",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: "18px",
    marginBottom: "20px",
    color: "#666",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  inputGroup: {
    width: "100%",
    marginBottom: "15px",
    textAlign: "left",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "14px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#333",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  signUpLink: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#007bff",
    textDecoration: "none",
  },
  error: {
    color: "red",
    marginBottom: "15px",
  },
};

export default Login;
