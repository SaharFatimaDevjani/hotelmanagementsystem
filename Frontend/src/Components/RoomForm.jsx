import React, { useState } from "react";

const ROOM_TYPES = [
  "Single Room",
  "Double Room",
  "Twin Room",
  "Suite",
  "Deluxe Room",
  "Family Room",
];

const RoomForm = ({ initialData = {}, onSubmit, isEdit = false, rooms = [] }) => {
  const [form, setForm] = useState({
    roomNumber: "",
    type: "",
    capacity: 1,
    ratePerNight: "",
    discount: "",
    description: "",
    available: true,
    ...initialData,
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.roomNumber) errs.roomNumber = "Room number is required";
    if (!form.type) errs.type = "Type is required";
    if (!form.capacity || form.capacity < 1) errs.capacity = "Capacity must be at least 1";
    if (!form.ratePerNight) errs.ratePerNight = "Rate per night is required";
    if (rooms.some(r => r.roomNumber === form.roomNumber && (!isEdit || r.id !== initialData.id))) {
      errs.roomNumber = "Room number must be unique";
    }
    return errs;
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onSubmit(form);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 mb-10">
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-t-2xl px-6 py-4 shadow-lg">
        <h3 className="text-2xl font-bold text-center">
          {isEdit ? "Edit Room" : "Add New Room"}
        </h3>
      </div>

      <form
        className="bg-white p-8 rounded-b-2xl shadow-xl flex flex-col gap-6 border border-gray-200"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Room Number */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Room Number</label>
            <input
              type="text"
              name="roomNumber"
              value={form.roomNumber}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Room Number"
              required
            />
            {errors.roomNumber && <span className="text-red-500 text-sm">{errors.roomNumber}</span>}
          </div>

          {/* Type */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Room Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Type</option>
              {ROOM_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.type && <span className="text-red-500 text-sm">{errors.type}</span>}
          </div>

          {/* Capacity */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Capacity</label>
            <input
              type="number"
              name="capacity"
              min="1"
              value={form.capacity}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Capacity"
              required
            />
            {errors.capacity && <span className="text-red-500 text-sm">{errors.capacity}</span>}
          </div>

          {/* Rate Per Night */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Rate Per Night</label>
            <input
              type="number"
              name="ratePerNight"
              min="0"
              value={form.ratePerNight}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Rate"
              required
            />
            {errors.ratePerNight && <span className="text-red-500 text-sm">{errors.ratePerNight}</span>}
          </div>

          {/* Discount */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Discount (%)</label>
            <input
              type="number"
              name="discount"
              min="0"
              max="100"
              value={form.discount}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0 - 100"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Room description..."
            rows="3"
          />
        </div>

        {/* Availability */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="available"
            checked={form.available}
            onChange={handleChange}
            className="w-5 h-5 accent-blue-600"
          />
          <span className="text-gray-700 font-medium">Available for booking</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition-all text-white px-6 py-3 rounded-lg w-full mt-3 font-semibold text-lg shadow"
        >
          Save Room
        </button>
      </form>
    </div>
  );
};

export default RoomForm;
