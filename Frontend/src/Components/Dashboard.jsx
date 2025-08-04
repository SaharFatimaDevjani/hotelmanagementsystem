import React from "react";
import BookingList from "./BookingList";

const Dashboard = () => (
  <div className="p-4">
    <h2 className="text-2xl font-bold mb-2 text-blue-700">Customer Dashboard</h2>
    <BookingList />
  </div>
);

export default Dashboard;