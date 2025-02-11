import React, { useState, useEffect } from "react";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");  // Retrieve token from local storage
      if (!token) throw new Error("No token found");
  
      const response = await fetch("https://python-rag-app-369543119888.us-central1.run.app/reports", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Error: ${error.detail}`);
      }
  
      const data = await response.json();
      console.log(data.reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const deleteReport = async (filename) => {
    if (!window.confirm(`Are you sure you want to delete ${filename}?`)) return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authorization token is missing. Please log in.");
      return;
    }
    try {
      const response = await fetch(
        `https://python-rag-app-369543119888.us-central1.run.app/reports/${filename}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      if (response.ok) {
        alert(`Report '${filename}' deleted successfully.`);
        fetchReports();
      } else {
        alert("Failed to delete report");
      }
    } catch (err) {
      alert("Error deleting report");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div>
      <h2>Uploaded Reports</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {reports.map((report, index) => (
          <li key={index}>
            {report}
            <button onClick={() => deleteReport(report)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reports;
