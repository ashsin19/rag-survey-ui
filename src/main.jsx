import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Query from "./pages/Query";
import Compare from "./pages/Compare";
import Reports from "./pages/ListReport";
import VectorstoreList from './pages/VectorStore'
import Navbar from "./components/Navbar"
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/query" element={<Query />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/reports" element={< Reports />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
