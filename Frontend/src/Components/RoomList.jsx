import React, { useState } from "react";
import API from "../Services/api";
import BookingForm from "./BookingForm";
import { useNavigate } from "react-router-dom";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  React.useEffect(() => {
    API.get("/rooms")
      .then((res) => setRooms(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleBookClick = (roomId) => {
    if (!token) {
      navigate('/login');
    } else {
      setSelectedRoomId(roomId);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Available Rooms</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div key={room.id} className="p-4 border rounded-lg shadow bg-white">
            <h3 className="font-semibold">{room.roomNumber} - {room.type}</h3>
            <p>Capacity: {room.capacity}</p>
            <p>Rate: ${room.ratePerNight}</p>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
              onClick={() => handleBookClick(room.id)}
            >
              Book Now
            </button>
            {selectedRoomId === room.id && token && (
              <BookingForm roomId={room.id} onBooked={() => setSelectedRoomId(null)} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;