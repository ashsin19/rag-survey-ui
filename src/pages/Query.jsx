import React, { useState , useEffect } from "react";
import loadRuntimeConfig  from '../components/config';

const Query = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [BASE_URL, setBackendUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [answer, setAnswer] = useState("");
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchConfig = async () => {
      const config = await loadRuntimeConfig();
      setBackendUrl(config.REACT_APP_BACKEND_URL);
    };
    fetchConfig();
  }, []);

  const handleQuery = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/query/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
          ,Authorization: `Bearer ${localStorage.getItem('token')}`
         },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setSummary(data.summary || "No summary available.");
      setAnswer(data.answer || "No answer available.");
      setDocuments(data.documents || []);
    } catch (error) {
      console.error("Query error:", error);
      alert("An error occurred while querying.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-800 text-white p-10">
      <h2 className="text-3xl font-bold mb-4">Query Reports</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter query..."
        className="mt-4 p-2 w-2/3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        style={{ color: "black" }}
      />
      <button
        onClick={handleQuery}
        className={`mt-4 p-2 w-1/4 bg-green-500 text-white rounded-md hover:bg-green-600 transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button>

      <div className="mt-6 w-2/3 bg-gray-900 p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold">Summary</h3>
        <p className="mt-2 text-gray-300">{summary}</p>
      </div>

      <div className="mt-6 w-2/3 bg-gray-900 p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold">Answer</h3>
        <p className="mt-2 text-gray-300">{answer}</p>
      </div>

      <div className="mt-6 w-2/3">
        <h3 className="text-lg font-semibold">Documents</h3>
        {documents.length > 0 ? (
          <div className="mt-2 bg-gray-900 p-4 rounded-lg shadow-lg">
            {documents.map((doc, idx) => (
              <div
                key={idx}
                className="p-2 border-b border-gray-700 text-gray-300"
              >
                {doc}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-gray-300">No documents found.</p>
        )}
      </div>
    </div>
  );
};
export default Query;
