import React, { useEffect, useState } from "react";
import API from "../Services/api";
import RoomForm from "../Components/RoomForm";
import { useNavigate } from "react-router-dom";

const AddRoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/rooms").then(res => setRooms(res.data));
  }, []);

  const handleSubmit = (form) => {
    API.post("/rooms", form)
      .then(() => navigate("/admin"))
      .catch(console.error);
  };

  return <RoomForm onSubmit={handleSubmit} rooms={rooms} />;
};

export default AddRoomPage;