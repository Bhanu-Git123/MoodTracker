import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async () => {
    setMessage("");
    setError("");

    const endpoint = isRegistering
      ? "http://localhost:5000/register"
      : "http://localhost:5000/login";

    const payload = isRegistering
      ? { name, email, password }
      : { email, password };

    try {
      const response = await axios.post(endpoint, payload);
      setMessage(response.data.message);

      if (!isRegistering) {
        localStorage.setItem("loggedInUser", email);
        setTimeout(() => navigate("/topup"), 500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "⚠️ Unable to connect. Please check your server or internet."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-400 via-pink-400 to-blue-400 p-4">
      <div className="w-full max-w-md p-8 bg-white/30 backdrop-blur-md rounded-xl shadow-xl transition-all">
        <h1 className="text-4xl font-bold text-center text-black mb-8">
          Mood Tracker
        </h1>

        {isRegistering && (
          <div className="mb-4 relative">
            <FaUser className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 pr-3 py-2 w-full rounded-md bg-white bg-opacity-80 border border-gray-300"
              required
            />
          </div>
        )}

        <div className="mb-4 relative">
          <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 pr-3 py-2 w-full rounded-md bg-white bg-opacity-80 border border-gray-300"
            required
          />
        </div>

        <div className="mb-4 relative">
          <FaLock className="absolute left-3 top-3 text-gray-500" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-3 py-2 w-full rounded-md bg-white bg-opacity-80 border border-gray-300"
            required
          />
        </div>

        <button
          onClick={handleAuth}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-md"
        >
          {isRegistering ? "Register" : "Login"}
        </button>

        <div className="text-center mt-4">
          <button
            className="text-white underline text-sm"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </button>
        </div>

        {message && (
          <p className="mt-3 text-green-700 text-center">{message}</p>
        )}
        {error && <p className="mt-3 text-red-600 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default AuthPage;
