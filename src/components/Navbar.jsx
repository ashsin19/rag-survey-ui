import React, { useState , useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Icons for menu and close
import "../assets/styles/Navbar.css"
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, handleLogout } = useAuth();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="animated-bg sticky w-full z-10 text-white">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600">
          <NavLink to="/" className="hover:text-blue-800">
            MyCompany
          </NavLink>
        </div>

        {/* Hamburger Menu Icon (visible on small screens) */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } md:flex md:space-x-8 absolute md:relative bg-white left-0 top-16 w-full md:w-auto py-4 md:py-0 md:top-auto shadow-md md:shadow-none bg-transparent !bg-transparent`}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
                `transition-colors text-white bg-transparent hover:bg-opacity-20 hover:bg-black rounded px-4 py-2 ${
                  isActive ? "text-gray-200" : "text-white"
                }`
              }
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/upload"
            className={({ isActive }) =>
                `transition-colors text-white bg-transparent hover:bg-opacity-20 hover:bg-black rounded px-4 py-2 ${
                  isActive ? "text-gray-200" : "text-white"
                }`
              }
            onClick={() => setMenuOpen(false)}
          >
            Upload
          </NavLink>
          <NavLink
            to="/query"
            className={({ isActive }) =>
                `transition-colors text-white bg-transparent hover:bg-opacity-20 hover:bg-black rounded px-4 py-2 ${
                  isActive ? "text-gray-200" : "text-white"
                }`
              }
            onClick={() => setMenuOpen(false)}
          >
            Query
          </NavLink>
          <NavLink
            to="/compare"
            className={({ isActive }) =>
                `transition-colors text-white bg-transparent hover:bg-opacity-20 hover:bg-black rounded px-4 py-2 ${
                  isActive ? "text-gray-200" : "text-white"
                }`
              }
            onClick={() => setMenuOpen(false)}
          >
            Compare
          </NavLink>
          <NavLink
            to="/reports"
            className={({ isActive }) =>
                `transition-colors text-white bg-transparent hover:bg-opacity-20 hover:bg-black rounded px-4 py-2 ${
                  isActive ? "text-gray-200" : "text-white"
                }`
              }
            onClick={() => setMenuOpen(false)}
          >
            Reports
          </NavLink>
        </div>
        {isLoggedIn && (
        <motion.button
          onClick={handleLogout}
          className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md 
                    hover:bg-red-500 hover:shadow-lg transition-transform transform 
                    hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Logout
        </motion.button>
      )}
      </div>
    </nav>
  );
};

export default Navbar;
