import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">Hotel Booking</h1>
      <div className="flex items-center space-x-6">
        <Link to="/" className="hover:underline hover:text-blue-100 transition">
          Home
        </Link>
        <Link to="/rooms" className="hover:underline hover:text-blue-100 transition">
          Rooms
        </Link>

        {!token && (
          <>
            <Link to="/login" className="hover:underline hover:text-blue-100 transition">
              Login
            </Link>

            <Link
              to="/register"
              className="
                px-4 py-2 rounded-lg
                bg-gradient-to-r from-blue-600 to-blue-400
                hover:from-blue-700 hover:to-blue-500
                text-white font-semibold
                shadow-md
                transition
              "
            >
              Register
            </Link>
          </>
        )}

        {token && (
          <>
            <Link to="/dashboard" className="hover:underline hover:text-blue-100 transition">
              Dashboard
            </Link>
            <Link to="/admin" className="hover:underline hover:text-blue-100 transition">
              Admin
            </Link>
            <button
              onClick={handleLogout}
              className="
                px-4 py-2 rounded-lg
                bg-gradient-to-r from-red-600 to-red-400
                hover:from-red-700 hover:to-red-500
                text-white font-semibold
                shadow-md
                transition
              "
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
