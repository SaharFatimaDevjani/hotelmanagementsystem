import React, { useEffect, useState } from "react";
import API from "../Services/api";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    API.get("/bookings")
      .then((res) => setBookings(res.data))
      .catch((err) => console.error("Error fetching bookings:", err));
  }, []);

  return (
    <div className="p-4 bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Your Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul>
          {bookings.map((b) => (
            <li key={b.id} className="mb-2 p-2 border-b">
              Room: <b>{b.room.roomNumber}</b> | Check-in: {b.checkIn} | Check-out: {b.checkOut} | Paid: {b.paymentStatus ? "Yes" : "No"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookingList;