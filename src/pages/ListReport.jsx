import React, { useState, useEffect } from "react";
import loadRuntimeConfig  from '../components/config';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

    const [BASE_URL, setBackendUrl] = useState("");

  useEffect(() => {
    const fetchConfig = async () => {
      const config = await loadRuntimeConfig();
      setBackendUrl(config.REACT_APP_BACKEND_URL);
    };
    fetchConfig();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");  // Retrieve token from local storage
      if (!token) throw new Error("No token found");
  
      const response = await fetch(`${BASE_URL}/reports/`, {
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
      // console.log(data.reports);
      setReports(data.reports || [])
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
        `${BASE_URL}/reports/${filename}`,
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-800 text-white p-10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Uploaded Reports</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {reports.map((report, index) => (
            <div
              key={index}
              className="bg-gray-700 rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow"
            >
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">{report}</h3>
              <p className="text-sm text-gray-300 mb-4">
                Uploaded document available for analysis.
              </p>
              <div className="flex justify-between">
                <button
                  className="bg-yellow-500 text-gray-900 py-2 px-4 rounded hover:bg-yellow-400 transition-colors"
                  onClick={() => alert(`Viewing details for ${report}`)}
                >
                  View Report
                </button>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-400 transition-colors"
                  onClick={() => deleteReport(report)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
