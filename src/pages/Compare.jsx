import React, { useState } from "react";

const Compare = () => {
  const [query, setQuery] = useState("");
  const [comparisonResults, setComparisonResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/compare/", {
        method: "POST",
        headers: { "Content-Type": "application/json" , Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setComparisonResults(data.comparison || []);
    } catch (error) {
      console.error("Comparison error:", error);
      alert("An error occurred while comparing.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-teal-400 to-blue-500 text-white p-10">
      <h2 className="text-2xl font-bold">Compare Reports</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter query..."
        className="mt-4 p-2 border"
      />
      <button onClick={handleCompare} className="mt-2 p-2 bg-purple-500 text-white rounded">
        {loading ? "Comparing..." : "Compare"}
      </button>
    </div>
  );
};
export default Compare;