import React, { useEffect, useState } from "react";
import API from "../Services/api";
import BookingForm from "../Components/BookingForm";
import { useNavigate } from "react-router-dom";

const AddBookingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/rooms").then(res => setRooms(res.data));
    API.get("/users").then(res => setCustomers(res.data));
  }, []);

  const handleSubmit = (form) => {
    API.post("/bookings", form)
      .then(() => navigate("/admin"))
      .catch(console.error);
  };

  return <BookingForm onSubmit={handleSubmit} rooms={rooms} customers={customers} />;
};

export default AddBookingPage;