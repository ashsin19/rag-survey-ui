import React, { useState , useEffect } from "react";
import loadRuntimeConfig  from '../components/config';
import { motion } from "framer-motion";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [BASE_URL, setBackendUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConfig = async () => {
      const config = await loadRuntimeConfig();
      setBackendUrl(config.REACT_APP_BACKEND_URL);
    };
    fetchConfig();
  }, []);

  const handleUpload = async () => {
    if (!file){
      setError("Please select a file before uploading.");
      return;
    } 
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > 8) {
      alert("File size exceeds the 8MB limit. Please upload a smaller file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    setError("");
    setLoading(true);
    
    try {
      const res = await fetch(`${BASE_URL}/upload/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Add token here
        },
        body: formData,
      });
      
      if (res.ok) alert("File uploaded successfully.");
      else alert("Upload failed.");
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-800 text-white p-10">
      <motion.h2
        className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Upload a Report
      </motion.h2>

      <div className="w-full max-w-md">
        <label className="block text-sm font-medium text-gray-300">Select a PDF Report</label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="mt-2 w-full text-gray-300 bg-gray-700 border border-gray-600 rounded-lg p-2"
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}

        <motion.button
          onClick={handleUpload}
          className="w-full mt-4 p-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-500 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
              </svg>
              Uploading...
            </div>
          ) : (
            "Upload"
          )}
        </motion.button>
      </div>

      {file && (
        <motion.div
          className="mt-6 p-4 bg-gray-800 rounded-lg shadow-lg w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-yellow-400">Selected File:</h3>
          <p className="text-gray-300">{file.name}</p>
          <p className="text-sm text-gray-500">File size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </motion.div>
      )}
    </div>
  );
};
export default Upload;
