import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import API from '../Services/api';

const Register = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    API.post("/users/register", form)
      .then(() => {
        API.post("/auth/login", form)
          .then((res) => {
            localStorage.setItem("token", res.data);
            navigate("/dashboard");
          })
          .catch(() => {
            setMessage("Registered, but login failed! Please login manually.");
          });
      })
      .catch((err) => setMessage(err.response?.data || "Error"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Gradient header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-4 text-center">
          <h2 className="text-2xl font-bold">Create Account</h2>
        </div>

        <form onSubmit={handleRegister} className="p-6 flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Username"
            onChange={e => setForm({ ...form, username: e.target.value })}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold py-2 rounded-lg shadow-md transition"
          >
            Register
          </button>
        </form>

        <div className="p-4 text-center">
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">
            Already have an account? Login
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

export default Register;
