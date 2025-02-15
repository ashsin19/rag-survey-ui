import React, { useState , useEffect } from "react";
import loadRuntimeConfig  from '../components/config';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [BASE_URL, setBackendUrl] = useState("");

  useEffect(() => {
    const fetchConfig = async () => {
      const config = await loadRuntimeConfig();
      setBackendUrl(config.REACT_APP_BACKEND_URL);
    };
    fetchConfig();
  }, []);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");
    const formData = new FormData();
    formData.append("file", file);
    console.log(formData);
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
      <h2 className="text-2xl font-bold">Upload a Report</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mt-4"
      />
      <button onClick={handleUpload} className="mt-2 p-2 bg-blue-500 text-white rounded">
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};
export default Upload;
