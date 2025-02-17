import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Icons for menu and close
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import "../assets/styles/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, handleLogout } = useContext(AuthContext); // Get auth state and logout function

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
          {["Home", "Upload", "Query", "Compare", "Reports"].map((page, i) => (
            <NavLink
              key={i}
              to={`/${page.toLowerCase()}`}
              className={({ isActive }) =>
                `transition-colors text-white bg-transparent hover:bg-opacity-20 hover:bg-black rounded px-4 py-2 ${
                  isActive ? "text-gray-200" : "text-white"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {page}
            </NavLink>
          ))}
        </div>

        {/* Logout Button (visible only if logged in) */}
        {isLoggedIn && (
          <motion.button
            onClick={handleLogout}
            className="hidden md:block bg-red-500 hover:bg-red-400 text-white px-6 py-2 rounded-lg transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Logout
          </motion.button>
        )}
      </div>

      {/* Logout Button (mobile version) */}
      {isLoggedIn && menuOpen && (
        <div className="block md:hidden mt-4">
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="w-full bg-red-500 hover:bg-red-400 text-white px-6 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
