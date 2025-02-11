// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import '../assets/styles/Login.css'

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
       const response = await axios.post(`${BASE_URL}/token`, new URLSearchParams({
         username,
         password,
       }), {
         headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
         },
       });

       const { access_token } = response.data;
       localStorage.setItem('token', access_token); // Save the token in localStorage
       localStorage.setItem('username',username)
      onLogin();
      setMessage('Login successful!');
    } catch (error) {
      console.error('Error logging in:', error);
      setMessage('Login failed. Please check your username and password.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>AI Insights</h1>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;