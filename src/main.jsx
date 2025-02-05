import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Query from "./pages/Query";
import Compare from "./pages/Compare";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/query" element={<Query />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
