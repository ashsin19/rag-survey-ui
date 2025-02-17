import React, { useState , useEffect } from "react";
import { motion } from "framer-motion";
import loadRuntimeConfig  from '../components/config';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"
import { checkTokenExpiration } from "../utils/checkTokenExpiration";

const Comparison = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [BASE_URL, setBackendUrl] = useState("");
  const { isLoggedIn, token, handleLogout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfig = async () => {
      const config = await loadRuntimeConfig();
      setBackendUrl(config.REACT_APP_BACKEND_URL);
    };
    fetchConfig();
  }, []);
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/"); // Redirect to home/login
    }
  }, [isLoggedIn, navigate]);

  const handleCompare = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    
    if (!token) {
      setError("You must be logged in to view comparisons.");
      setLoading(false);
      return;
    }

    if (checkTokenExpiration(token)) {
            alert("Session expired. Please login again.");
            handleLogout();
            return;
          }

    try {
      const response = await fetch(`${BASE_URL}/compare/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const text = await response.text(); // Debugging: Capture raw response

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = JSON.parse(text);
      setResults(data.comparisons);
    } catch (error) {
      console.error("Fetch Error:", error);
      setError("Failed to retrieve comparison results.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-800 text-white p-10">
      <motion.h2
        className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Compare Reports
      </motion.h2>

      <motion.input
        type="text"
        placeholder="Enter query..."
        className="mt-2 p-3 w-2/3 bg-gray-900 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />

      <motion.button
        onClick={handleCompare}
        className={`mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {loading ? "Comparing..." : "Compare"}
      </motion.button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {results && (
        <motion.div
          className="mt-10 w-full max-w-4xl space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {results.map((result, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition"
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="text-xl font-bold mb-2">
                {result.report_1} vs {result.report_2}
              </h4>

              <div className="mt-4">
                <h5 className="text-lg font-semibold text-green-400">Common Insights:</h5>
                {result.comparison.common_insights.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-300 mt-2">
                    {result.comparison.common_insights.map((insight, i) => (
                      <li key={i}>{insight}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No common insights found.</p>
                )}
              </div>

              <div className="mt-4">
                <h5 className="text-lg font-semibold text-blue-400">
                  Unique to {result.report_1}:
                </h5>
                {result.comparison.unique_in_report_1.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-300 mt-2">
                    {result.comparison.unique_in_report_1.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No unique insights found.</p>
                )}
              </div>

              <div className="mt-4">
                <h5 className="text-lg font-semibold text-purple-400">
                  Unique to {result.report_2}:
                </h5>
                {result.comparison.unique_in_report_2.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-300 mt-2">
                    {result.comparison.unique_in_report_2.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No unique insights found.</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Comparison;
