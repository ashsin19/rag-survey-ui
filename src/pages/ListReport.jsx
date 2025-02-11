import React, { useState, useEffect } from "react";

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      const response = await fetch("https://python-rag-app-369543119888.us-central1.run.app/reports/");
      const data = await response.json();
      setReports(data.reports || []);
    } catch (err) {
      setError("Failed to fetch reports");
    }
  };

  const deleteReport = async (filename) => {
    if (!window.confirm(`Are you sure you want to delete ${filename}?`)) return;

    try {
      const response = await fetch(
        `https://python-rag-app-369543119888.us-central1.run.app/reports/${filename}`,
        {
          method: "DELETE",
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

export default ReportList;
