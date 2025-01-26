import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Certificate {
  title: string;
  tokenId: string;
  ipfsHash: string;
  status: string;
}

const certificates: Certificate[] = [
  {
    title: "Introduction to Computer Studies",
    tokenId: "04557",
    ipfsHash: "45879355ds487521sd521",
    status: "Verified",
  },
  {
    title: "Computer Networks",
    tokenId: "04747",
    ipfsHash: "45879482ds487521sd521",
    status: "Verified",
  },
  {
    title: "Programming with JAVA",
    tokenId: "04557",
    ipfsHash: "8698232547484521sd521",
    status: "Pending",
  },
];

const DashboardPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = location.state || {};
  const id = user.id || "No ID Provided";
  const name = user.name || "No Name Provided";
  const email = user.email || "No Email Provided";
  const university = user.university || "No University Provided";

  const handleView = (certificate: Certificate) => {
    navigate("/application-portal", { state: { certificate } });
  };

  const handleCertificateRequest = () => {
    navigate("/application-portal", {
      state: { certificate: { title: "Academic Certificate Store" }, user },
    });
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>Dr. FANS</header>
      <main style={styles.main}>
        <h1 style={styles.title}>My Profile</h1>
        <div style={styles.profileSection}>
          <div style={styles.avatar}></div>
          <div style={styles.profileInfo}>
            <p>
              <strong>ID:</strong> {id}
            </p>
            <p>
              <strong>Name:</strong> {name}
            </p>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>University:</strong> {university}
            </p>
          </div>
        </div>
        <div style={styles.certificatesSection}>
          {certificates.map((cert, index) => (
            <div key={index} style={styles.card}>
              <h3>{cert.title}</h3>
              <p>Token ID: {cert.tokenId}</p>
              <p>IPFS Hash: {cert.ipfsHash}</p>
              <p>Verification Status: {cert.status}</p>
              <button style={styles.button} onClick={() => handleView(cert)}>
                View
              </button>
            </div>
          ))}
        </div>
        <div style={styles.requestSection}>
          <h2>Request to Store Academic Certificate</h2>
          <p>
            Store your academic certificate on the blockchain for secure and
            verifiable credentials.
          </p>
          <button
            style={styles.requestButton}
            onClick={handleCertificateRequest}
          >
            Request to Store Academic Certificate
          </button>
        </div>
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
  },
  main: {
    padding: "20px",
  },
  title: {
    fontSize: "28px",
    marginBottom: "20px",
  },
  profileSection: {
    display: "flex",
    alignItems: "center",
    marginBottom: "30px",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#ddd",
    marginRight: "20px",
  },
  profileInfo: {
    textAlign: "left",
  },
  certificatesSection: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "20px",
    width: "300px",
    textAlign: "left",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  button: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#333",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  requestSection: {
    marginTop: "40px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  requestButton: {
    marginTop: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#333",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default DashboardPage;
