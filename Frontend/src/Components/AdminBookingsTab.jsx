import React, { useEffect, useState } from "react";
import API from "../Services/api";

const AdminBookingsTab = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    API.get("/bookings/all")
      .then(res => setBookings(res.data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">All Bookings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookings.map(b => (
          <div key={b.id} className="p-4 border rounded-lg shadow bg-gray-50 mb-2">
            <div><b>Room:</b> {b.room.roomNumber} ({b.room.type})</div>
            <div><b>Customer:</b> {b.customer.username}</div>
            <div><b>Check-In:</b> {b.checkIn}</div>
            <div><b>Check-Out:</b> {b.checkOut}</div>
            <div><b>Total Price:</b> ${b.totalPrice}</div>
            <div><b>Payment Method:</b> {b.paymentMethod}</div>
            <div><b>Paid:</b> {b.paymentStatus ? "Yes" : "No"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBookingsTab;