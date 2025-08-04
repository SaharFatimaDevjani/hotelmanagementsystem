import React, { useState } from 'react';
import API from '../Services/api';
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    API.post("/auth/login", form)
      .then((res) => {
        localStorage.setItem("token", res.data);
        setMessage("Login successful!");
        const decoded = jwtDecode(res.data);
        const role = decoded.role?.toUpperCase();
        if (role === "ADMIN") navigate("/admin");
        else navigate("/dashboard");
      })
      .catch((err) => {
        let errorMsg = "Login failed!";
        if (err.response && err.response.data) {
          errorMsg = typeof err.response.data === "string"
            ? err.response.data
            : JSON.stringify(err.response.data);
        }
        setMessage(errorMsg);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Gradient header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-4 text-center">
          <h2 className="text-2xl font-bold">Login</h2>
        </div>

        <form onSubmit={handleLogin} className="p-6 flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold py-2 rounded-lg shadow-md transition"
          >
            Login
          </button>
        </form>

        <div className="p-4 text-center">
          <Link to="/register" className="text-blue-600 hover:underline font-semibold">
            Don't have an account? Register
          </Link>
        </div>

        {message && (
          <p
            className={`pb-4 text-center font-medium ${
              message.includes('successful') ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
