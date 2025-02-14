import React, { useEffect, useState } from 'react';
import "../assets/styles/Vectorstore.css"

const VectorstoreList = () => {
  const [vectorstores, setVectorstores] = useState([]);

  const fetchVectorstores = async () => {
    const BASE_URL = 'https://python-rag-app-369543119888.us-central1.run.app';
    const token = localStorage.getItem("token");  // Retrieve token from local storage
      if (!token) throw new Error("No token found");
    try {
      const response = await fetch(`${BASE_URL}/list-vectorstores`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch vectorstores: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Available vectorstores:', data.vectorstores);
      setVectorstores(data.vectorstores);
    } catch (error) {
      console.error('Error fetching vectorstores:', error);
    }
  };

  useEffect(() => {
    fetchVectorstores();
  }, []);

  return (
    <div className="vectorstore-container">
      <h1 className="vectorstore-title">Available Vector Stores</h1>
      <div className="vectorstore-list">
      {vectorstores.length > 0 ? (
        <ul>
          {vectorstores.map((store, index) => (
            <li key={index} className="vectorstore-item"><span>{store}</span></li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-400">No vector stores found.</p>
      )}
      </div>
    </div>
  );
};

export default VectorstoreList;
