import React from "react";
import ReactDOM from "react-dom/client";
import App from "../src/App";
import "./styles.css";
import DocumentUpload from "../src/components/DocumentUpload";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DocumentsListPage from "../src/components/DocumentsListPage";
import DocumentDetailPage from "../src/components/DocumentDetailPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <DocumentUpload /> */}
    <Router>
      <Routes>
        <Route path="/" element={<DocumentsListPage />} />
        <Route path="/document/:id" element={<DocumentDetailPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
