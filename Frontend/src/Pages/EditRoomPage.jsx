import React, { useEffect, useState } from "react";
import API from "../Services/api";
import RoomForm from "../Components/RoomForm";
import { useNavigate, useParams } from "react-router-dom";

const EditRoomPage = () => {
  const [room, setRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    API.get("/rooms")
      .then(res => setRooms(res.data))
      .catch(err => {
        console.error("Error loading rooms:", err);
        setError("Could not load rooms list.");
      });

    API.get(`/rooms/${id}`)
      .then(res => setRoom(res.data))
      .catch(err => {
        console.error("Error loading room:", err);
        setError("Room not found or server error.");
      });
  }, [id]);

  const handleSubmit = (form) => {
    API.put(`/rooms/${id}`, form)
      .then(() => navigate("/admin"))
      .catch(err => {
        console.error("Error updating room:", err);
        setError("Failed to update room.");
      });
  };

  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!room) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-8">
      <RoomForm initialData={room} onSubmit={handleSubmit} isEdit={true} rooms={rooms} />
    </div>
  );
};

export default EditRoomPage;
