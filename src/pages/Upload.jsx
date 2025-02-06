import React, { useState } from "react";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");
    const formData = new FormData();
    formData.append("file", file);
    console.log(formData);
    setLoading(true);
    
    try {
      const res = await fetch("http://localhost:8000/upload/", {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-teal-400 to-blue-500 text-white p-10">
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
