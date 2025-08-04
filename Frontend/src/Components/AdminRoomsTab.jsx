import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Services/api";

const AdminRoomsTab = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/rooms")
      .then(res => setRooms(res.data))
      .catch(console.error);
  }, []);

  const handleEdit = id => {
    navigate(`/admin/rooms/edit/${id}`);
  };

  const handleDelete = id => {
    API.delete(`/rooms/${id}`)
      .then(() => setRooms(rooms.filter(room => room.id !== id)))
      .catch(console.error);
  };

  const handleAddNew = () => {
    navigate("/admin/rooms/add");
  };

  return (
    <div>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        onClick={handleAddNew}
      >
        Add New Room
      </button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rooms.map(room => (
          <div key={room.id} className="p-4 border rounded-lg shadow bg-gray-50">
            <div><b>Room Number:</b> {room.roomNumber}</div>
            <div><b>Type:</b> {room.type}</div>
            <div><b>Capacity:</b> {room.capacity}</div>
            <div><b>Rate:</b> ${room.ratePerNight}</div>
            <div><b>Discount:</b> {room.discount}%</div>
            <div><b>Available:</b> {room.available ? "Yes" : "No"}</div>
            <div className="mt-2 flex space-x-2">
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => handleEdit(room.id)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleDelete(room.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRoomsTab;