import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AdminRoomsTab from "../Components/AdminRoomsTab";
import AdminUsersTab from "../Components/AdminUsersTab";
import AdminBookingsTab from "../Components/AdminBookingsTab";

const tabs = [
  { name: "Rooms", component: <AdminRoomsTab /> },
  { name: "Users", component: <AdminUsersTab /> },
  { name: "Bookings", component: <AdminBookingsTab /> },
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.role?.toUpperCase() !== "ADMIN") {
        navigate("/dashboard");
      }
    } catch (err) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="p-8 bg-white rounded-xl shadow-md max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Admin Panel</h2>
      <div className="flex space-x-4 mb-6">
        {tabs.map((tab, idx) => (
          <button
            key={tab.name}
            className={`px-4 py-2 rounded ${
              activeTab === idx ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab(idx)}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div>{tabs[activeTab].component}</div>
    </div>
  );
};

export default AdminPanel;