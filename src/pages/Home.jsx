// File: src/pages/Home.jsx
import React, { useState , useEffect } from "react";
import { motion } from "framer-motion";
import { FaUpload, FaSearch, FaChartBar } from "react-icons/fa";
import { Link } from "react-router-dom";
import Login from './Login';
import loadRuntimeConfig  from '../components/config';
import { useAuth } from "../context/AuthContext";
import { checkTokenExpiration } from "../utils/checkTokenExpiration";

const Home = () => {
  const { isLoggedIn, token, handleLogin, handleLogout  } = useAuth();
  const [stats, setStats] = useState({
    reportsProcessed: 0,
    fastestQueryTime: "N/A",
    comparisonCount: 0,
  });
  const [BASE_URL, setBackendUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      const config = await loadRuntimeConfig();
      setBackendUrl(config.REACT_APP_BACKEND_URL);
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    if (checkTokenExpiration(token)) {
      alert("Token expired. Logging out...");
      handleLogout();
      return;
    }
    const fetchStats = async (url) => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(`${url}/stats/`, {
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

    if (isLoggedIn) {
      fetchStats(`${BASE_URL}`);
    }

  },[isLoggedIn,BASE_URL,token,handleLogout])

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5 },
    }),
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-800 text-white p-10">
      {isLoggedIn ? (
        <div className="max-w-4xl text-center">
          <motion.h1
            className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            AI-Powered Insights Platform
          </motion.h1>
          <motion.p
            className="text-lg mb-8 text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Uncover hidden insights from your data using cutting-edge AI models. Upload reports, run detailed queries, and compare results seamlessly.
          </motion.p>

          {/* Animated Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {[
              {
                icon: <FaUpload className="text-blue-400 text-4xl mb-2 mx-auto" />,
                title: "Reports Processed",
                value: loading ? "Loading..." : stats.reportsProcessed,
              },
              {
                icon: <FaSearch className="text-green-400 text-4xl mb-2 mx-auto" />,
                title: "Fastest Query Time",
                value: loading ? "Loading..." : stats.fastestQueryTime,
              },
              {
                icon: <FaChartBar className="text-purple-400 text-4xl mb-2 mx-auto" />,
                title: "Comparisons Made",
                value: loading ? "Loading..." : stats.comparisonCount,
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="p-4 bg-gray-800 rounded-lg shadow-lg"
                custom={i}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
              >
                {stat.icon}
                <h3 className="text-xl font-semibold">{stat.title}</h3>
                <p className="text-gray-400 text-lg">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Navigation Links with Hover Animation */}
          <motion.nav
            className="mt-6 flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {[
              {
                to: "/upload",
                label: "Upload Report",
                color: "bg-blue-500 hover:bg-blue-400",
                icon: <FaUpload className="inline-block mr-2" />,
              },
              {
                to: "/query",
                label: "Query Report",
                color: "bg-green-500 hover:bg-green-400",
                icon: <FaSearch className="inline-block mr-2" />,
              },
              {
                to: "/compare",
                label: "Compare Reports",
                color: "bg-purple-500 hover:bg-purple-400",
                icon: <FaChartBar className="inline-block mr-2" />,
              },
            ].map((link, i) => (
              <motion.div key={i} whileHover={{ scale: 1.1 }}>
                <Link
                  to={link.to}
                  className={`${link.color} text-white px-8 py-3 font-semibold rounded-lg shadow-lg transition`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default Home;