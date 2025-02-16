// src/Login.js
import React, { useState, useEffect }  from 'react';
import { useAuth } from "../context/AuthContext";
import axios from 'axios';
import '../assets/styles/Login.css';
import loadRuntimeConfig  from '../components/config';

const Login = () => {
  const [localUsername, setLocalUsername] = useState("");
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [BASE_URL, setBackendUrl] = useState("");
  const { handleLogin } = useAuth();

  useEffect(() => {
    const fetchConfig = async () => {
      const config = await loadRuntimeConfig();
      setBackendUrl(config.REACT_APP_BACKEND_URL);
    };
    fetchConfig();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
       const response = await axios.post(`${BASE_URL}/token`, new URLSearchParams({
        username: localUsername,
        password,
       }), {
         headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
         },
       });

       const { access_token } = response.data;
       localStorage.setItem('token', access_token); // Save the token in localStorage
       localStorage.setItem("username", localUsername)
       handleLogin(localUsername, access_token);
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
            value={localUsername}
            onChange={(e) => setLocalUsername(e.target.value)}
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