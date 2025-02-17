import React, { useState , useEffect } from "react";
import { motion } from "framer-motion";
import loadRuntimeConfig  from '../components/config';
import { useAuth } from "../context/AuthContext"; 
import { useNavigate } from "react-router-dom";
import { checkTokenExpiration } from "../utils/checkTokenExpiration";

const Query = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [BASE_URL, setBackendUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [answer, setAnswer] = useState("");
  const [wordCloud, setWordCloud] = useState("");
  const [documents, setDocuments] = useState([]);
  const { isLoggedIn, token } = useAuth(); 
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
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleQuery = async () => {
    if (!query) return;
    if (checkTokenExpiration(token)) {
          alert("Token expired. Logging out...");
          handleLogout();
          return;
        }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/query/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
          ,Authorization: `Bearer ${token}`
         },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setSummary(data.summary || "No summary available.");
      setAnswer(data.answer || "No answer available.");
      setDocuments(data.documents || []);
      setWordCloud(data.summary_wordcloud);
    } catch (error) {
      console.error("Query error:", error);
      alert("An error occurred while querying.");
    }
    setLoading(false);
  };

  return (
<div className="min-h-[90vh] flex flex-col items-center bg-gradient-to-br from-black to-gray-800 text-white p-10">
  <motion.h2
    className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    Query Reports
  </motion.h2>

  <div className="w-full max-w-2xl">
    <label className="block text-sm font-medium text-gray-300">Enter your query</label>
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Enter query..."
      className="mt-2 p-3 w-full text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
    />
    <motion.button
      onClick={handleQuery}
      className={`mt-4 w-full bg-green-500 text-white py-3 font-bold rounded-lg shadow-lg hover:bg-green-600 transition ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      whileHover={!loading ? { scale: 1.05 } : {}}
      whileTap={{ scale: 0.95 }}
      disabled={loading}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
            ></path>
          </svg>
          Searching...
        </div>
      ) : (
        "Search"
      )}
    </motion.button>
  </div>

  <div className="mt-10 w-full max-w-3xl">
    <div className="mb-6 bg-gray-900 p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold text-yellow-400">Summary</h3>
      <p className="mt-4 text-gray-300">{summary || "No summary available."}</p>
    </div>

    <div className="mb-6 bg-gray-900 p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold text-green-400">Answer</h3>
      <p className="mt-4 text-gray-300">{answer || "No answer found."}</p>
    </div>
    
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold text-blue-400">Documents</h3>
      {documents.length > 0 ? (
        <div className="mt-4 space-y-4">
          {documents.map((doc, idx) => (
            <motion.div
              key={idx}
              className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <p className="text-gray-300">{doc}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-300">No documents found.</p>
      )}
    </div>
    <div className="mt-6 w-2/3 bg-gray-900 p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold">Word Cloud</h3>
        {wordCloud ? (
          <img
            src={`data:image/png;base64,${wordCloud}`}
            alt="Word Cloud"
            className="mt-4 rounded-lg shadow-lg"
          />
        ) : (
          <p className="mt-2 text-gray-300">No word cloud available.</p>
        )}
      </div>
  </div>
</div>
  );
};
export default Query;
