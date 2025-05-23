import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Home from "./Home";
import TokenForm from "./components/TokenForm";
import "./styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MetaMaskProvider } from "./contexts/MetaMaskContext";
import VerifyCertificate from "./components/VerifyCertificate";
import DocumentsListPage from "./components/DocumentsListPage";
import DocumentDetailPage from "./components/DocumentDetailPage";
import DocumentUpload from "./components/DocumentUpload";
import Signup from "./components/LoginPages/Signup";
import Login from "./components/LoginPages/Login";
import DashboardPage from "./components/LoginPages/DashboardPage";
import ApplicationPortalPage from "./components/LoginPages/ApplicationPortalPage";
import { UserProvider } from "./contexts/UserContext";
import ConnectToOtherChainsForm from "./components/ConnectToOtherChainsForm";
import AdminDashboardPage from "./components/LoginPages/AdminDashboardPage";
import InstitutionExemptionPage from "./components/InstitutionExemptionPage";
import ExemptionRequestPage from "./components/ExemptionRequestPage";
import ReviewExemptionRequestsPage from "./components/ReviewExemptionRequestsPage";
import InstDashboardPage from "./components/LoginPages/InstDashboardPage";
import IssuedCredentialsPage from "./components/IssuedCredentialsPage";
import ExemptionStatusPage from "./components/ExemptionStatusPage";
// import ImportTokenForm from "./components/ImportTokenForm";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <DocumentUpload>DocumentUpload> */}
    <UserProvider>
      <MetaMaskProvider>
        <BrowserRouter>
          <Routes>
            \\temp
            {/* <Route path="/" element={<ReviewExemptionRequestsPage />} /> */}
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
            <Route
              path="/Inst-admin-dashboard"
              element={<InstDashboardPage />}
            />
            <Route path="/issue" element={<TokenForm />} />
            <Route path="/verify" element={<VerifyCertificate />} />
            //change here ; Document Upload
            <Route path="/DocUp" element={<DocumentUpload />} />
            <Route path="/viewAll" element={<DocumentsListPage />} />
            <Route path="/exempstat" element={<ExemptionStatusPage />} />
            <Route path="/reqexemp" element={<ExemptionRequestPage />} />
            <Route path="/document/:id" element={<DocumentDetailPage />} />
            <Route path="/adminexemp" element={<InstitutionExemptionPage />} />
            <Route
              path="/adminrevexemp"
              element={<ReviewExemptionRequestsPage />}
            />
            <Route path="/issueView" element={<IssuedCredentialsPage />} />
            <Route path="*" element={<h1>404: Page Not Found</h1>} />
          </Routes>
        </BrowserRouter>
      </MetaMaskProvider>
    </UserProvider>
    {/* <Home /> */}
  </React.StrictMode>
);
