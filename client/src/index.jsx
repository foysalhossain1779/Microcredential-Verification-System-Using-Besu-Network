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
            {/* <Route path="/" element={<ConnectToOtherChainsForm />} /> */}

            <Route path="/" element={<Home />} />

            <Route path="/signup" element={<Signup />} />

            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin-dashboard" element={<AdminDashboardPage />} />

            {/* <Route path="/" element={<Home />}></Route> */}
            <Route path="/issue" element={<TokenForm />} />
            <Route path="/verify" element={<VerifyCertificate />} />
            <Route path="/DocUp" element={<DocumentUpload />} />
            <Route path="/viewAll" element={<DocumentsListPage />} />
            <Route path="/document/:id" element={<DocumentDetailPage />} />
            <Route path="*" element={<h1>404: Page Not Found</h1>} />
          </Routes>

          {/* <Router>
          <Routes>
            <Route path="/" element={<DocumentsListPage />} />
            <Route path="/document/:id" element={<DocumentDetailPage />} />
          </Routes>
        </Router> */}
        </BrowserRouter>
      </MetaMaskProvider>
    </UserProvider>
    {/* <Home /> */}
  </React.StrictMode>
);
