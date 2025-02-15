// File: src/pages/Home.jsx
import React, { useState , useEffect } from "react";
import { Link } from "react-router-dom";
import Login from './Login';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stats, setStats] = useState({
    reportsProcessed: 0,
    fastestQueryTime: "N/A",
    comparisonCount: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch("https://python-rag-app-369543119888.us-central1.run.app/stats/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch stats");

      const data = await response.json();
      setStats({
        reportsProcessed: data.reportsProcessed,
        fastestQueryTime: data.fastestQueryTime,
        comparisonCount: data.comparisonCount,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchStats();
    }
  }, [isLoggedIn]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5 },
    }),
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-800 text-white p-10">
      {isLoggedIn ? (
        <div className="max-w-4xl text-center">
          <motion.h1 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
            AI-Powered Insights Platform
          </motion.h1>
          <motion.p className="text-lg mb-8 text-gray-300">
            Uncover hidden insights from your data using cutting-edge AI models. Upload reports, run detailed queries, and compare results seamlessly.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {[{ title: "Reports Processed", value: stats.reportsProcessed, icon: FaUpload },
              { title: "Fastest Query Time", value: stats.fastestQueryTime, icon: FaSearch },
              { title: "Comparisons Made", value: stats.comparisonCount, icon: FaChartBar }].map((stat, i) => (
              <motion.div key={i} className="p-4 bg-gray-800 rounded-lg shadow-lg">
                <stat.icon className="text-4xl mb-2 mx-auto" />
                <h3 className="text-xl font-semibold">{stat.title}</h3>
                <p className="text-gray-400 text-lg">{loading ? "Loading..." : stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default Home;