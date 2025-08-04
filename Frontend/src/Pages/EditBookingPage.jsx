import React, { useEffect, useState } from "react";
import API from "../Services/api";
import BookingForm from "../Components/BookingForm";
import { useNavigate, useParams } from "react-router-dom";

const EditBookingPage = () => {
  const [booking, setBooking] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    API.get("/rooms").then(res => setRooms(res.data));
    API.get("/users").then(res => setCustomers(res.data));
    API.get(`/bookings/${id}`).then(res => setBooking(res.data));
  }, [id]);

  const handleSubmit = (form) => {
    API.put(`/bookings/${id}`, form)
      .then(() => navigate("/admin"))
      .catch(console.error);
  };

  if (!booking) return <div className="p-8 text-center">Loading...</div>;
  return (
    <div className="max-w-xl mx-auto mt-8">
      <BookingForm initialData={booking} onSubmit={handleSubmit} isEdit rooms={rooms} customers={customers} />
    </div>
  );
};

export default EditBookingPage;