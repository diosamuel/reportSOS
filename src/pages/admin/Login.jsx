import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  let navigate = useNavigate()
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Login successful`);
        navigate("/admin/report")
      } else {
        setMessage("Login failed: Invalid credentials");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-4xl font-semibold mb-5 rounded-full bg-red-500 text-white p-5">
        🚨ReportSOS Admin
      </h1>
      <form
        className="bg-white p-6 rounded-lg shadow-lg w-80"
        onSubmit={handleLogin}
      >
        <h2 className="text-xl font-bold mb-4 text-center">Login Admin</h2>

        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
        >
          Login
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-red-600">{message}</p>
        )}
      </form>
    </div>
  );
};

export default Login;
