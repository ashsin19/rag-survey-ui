// File: src/pages/Home.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Login from './Login';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogin = () => {
    setIsLoggedIn(true); // Set logged-in state to true upon successful login
  };

  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-teal-400 to-blue-500 text-white p-10">
    {isLoggedIn ? ( // Conditional rendering based on login status
             <div>
            <h1 className="text-5xl font-extrabold mb-4 text-center">AI-Powered Insights</h1>
            <p className="text-lg text-center max-w-2xl">
             Extract meaningful insights from user responses using advanced AI algorithms. Upload reports, analyze data, and compare responses effortlessly.
            </p>
            <nav className="mt-6 flex gap-6">
            <Link to="/upload" className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg transition transform hover:scale-105 hover:bg-gray-200">Upload Report</Link>
            <Link to="/query" className="px-6 py-3 bg-white text-green-600 font-semibold rounded-lg shadow-lg transition transform hover:scale-105 hover:bg-gray-200">Query Report</Link>
            <Link to="/compare" className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg shadow-lg transition transform hover:scale-105 hover:bg-gray-200">Compare Reports</Link>
            </nav>
            </div>
            ) : (
                <Login className="login-form" onLogin={handleLogin} />
      )}
    </div>
  );
};
export default Home;