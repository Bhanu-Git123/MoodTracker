import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Only for registration
  const [isRegistering, setIsRegistering] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleAuth = async () => {
    const endpoint = isRegistering
      ? "http://localhost:5000/register"
      : "http://localhost:5000/login";

    const payload = isRegistering
      ? { name, email, password }
      : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok && !isRegistering) {
        navigate("/mood-selection");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage("Something went wrong! Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-2xl font-bold text-purple-600 mb-4">
        {isRegistering ? "Register" : "Login"}
      </h1>

      {isRegistering && (
        <input
          className="p-2 border rounded w-64 mb-2 text-black dark:text-white bg-white dark:bg-gray-800"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}

      <input
        className="p-2 border rounded w-64 mb-2 text-black dark:text-white bg-white dark:bg-gray-800"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="p-2 border rounded w-64 mb-4 text-black dark:text-white bg-white dark:bg-gray-800"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-purple-500 text-white p-2 rounded w-64"
        onClick={handleAuth}
      >
        {isRegistering ? "Register" : "Login"}
      </button>

      <button
        className="mt-2 text-sm text-purple-600"
        onClick={() => setIsRegistering(!isRegistering)}
      >
        {isRegistering
          ? "Already have an account? Login"
          : "Don't have an account? Register"}
      </button>

      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
};

export default AuthPage;
