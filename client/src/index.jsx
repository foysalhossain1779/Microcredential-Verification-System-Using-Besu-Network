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

// import DocumentUpload from "./DocumentUpload";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <DocumentUpload>DocumentUpload> */}
    <MetaMaskProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/issue" element={<TokenForm />} />
          <Route path="/verify" element={<VerifyCertificate />} />
          <Route path="/DocUp" element={<DocumentUpload />} />
          <Route path="/viewAll" element={<DocumentsListPage />} />
          <Route path="/document/:id" element={<DocumentDetailPage />} />
        </Routes>

        {/* <Router>
          <Routes>
            <Route path="/" element={<DocumentsListPage />} />
            <Route path="/document/:id" element={<DocumentDetailPage />} />
          </Routes>
        </Router> */}
      </BrowserRouter>
    </MetaMaskProvider>
    {/* <Home /> */}
  </React.StrictMode>
);
