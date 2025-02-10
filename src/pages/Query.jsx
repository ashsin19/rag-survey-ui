import React, { useState } from "react";

const Query = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleQuery = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/query/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
          ,Authorization: `Bearer ${localStorage.getItem('token')}`
         },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Query error:", error);
      alert("An error occurred while querying.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-800 text-white p-10">
      <h2 className="text-2xl font-bold">Query Reports</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter query..."
        className="mt-4 p-2 border"
      />
      <button onClick={handleQuery} className="mt-2 p-2 bg-green-500 text-white rounded">
        {loading ? "Searching..." : "Search"}
      </button>
      <div className="mt-4 w-1/2">
        {results.map((res, idx) => (
          <div key={idx} className="p-2 border-b">{res}</div>
        ))}
      </div>
    </div>
  );
};
export default Query;
