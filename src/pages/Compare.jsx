import React, { useState } from "react";

const Comparison = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;
  const handleCompare = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    const token = localStorage.getItem("token"); // Ensure token is stored in localStorage
    if (!token) {
      setError("You must be logged in to view comparisons.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://python-rag-app-369543119888.us-central1.run.app/compare/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const text = await response.text(); // Debugging: Capture raw response
      console.log("Raw Response:", text);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = JSON.parse(text);
      console.log("Parsed JSON:", data);
      setResults(data.comparisons);
    } catch (error) {
      console.error("Fetch Error:", error);
      setError("Failed to retrieve comparison results.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-800 text-white p-10">
      <h2 className="text-2xl font-bold">Compare Reports</h2>

      <input
        type="text"
        placeholder="Enter query..."
        className="mt-4 p-2 border"
        value={query}
        style={{color:"black"}}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        onClick={handleCompare}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Loading..." : "Compare"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {results && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Comparison Results</h3>
          {results.length === 0 ? (
            <p className="text-gray-500">No comparisons found.</p>
          ) : (
            results.map((result, index) => (
              <div key={index} className="border p-4 mt-4 rounded shadow">
                <h4 className="font-bold">
                  {result.report_1} vs {result.report_2}
                </h4>
                <div className="mt-2">
                  <h5 className="font-semibold">Common Insights:</h5>
                  {result.comparison.common_insights.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {result.comparison.common_insights.map((insight, i) => (
                        <li key={i}>{insight}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No common insights found.</p>
                  )}
                </div>

                <div className="mt-2">
                  <h5 className="font-semibold">Unique to {result.report_1}:</h5>
                  {result.comparison.unique_in_report_1.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {result.comparison.unique_in_report_1.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No unique insights found.</p>
                )}
                </div>

                <div className="mt-2">
                  <h5 className="font-semibold">Unique to {result.report_2}:</h5>
                  {result.comparison.unique_in_report_2.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {result.comparison.unique_in_report_2.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No unique insights found.</p>
                )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Comparison;
