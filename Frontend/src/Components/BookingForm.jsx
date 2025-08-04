import React, { useState } from "react";

const BookingForm = ({ initialData = {}, onSubmit, rooms = [], customers = [], isEdit = false }) => {
  const [form, setForm] = useState({
    roomId: "",
    customerId: "",
    checkIn: "",
    checkOut: "",
    paymentMethod: "CASH",
    ...initialData,
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.roomId) errs.roomId = "Room is required";
    if (!form.customerId) errs.customerId = "Customer is required";
    if (!form.checkIn) errs.checkIn = "Check-in date is required";
    if (!form.checkOut) errs.checkOut = "Check-out date is required";
    if (!form.paymentMethod) errs.paymentMethod = "Payment method is required";
    return errs;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: value,
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
    <form className="p-4 border rounded-lg bg-white" onSubmit={handleSubmit}>
      <h3 className="text-lg font-bold mb-2">{isEdit ? "Edit Booking" : "Add Booking"}</h3>
      <label className="block mb-2">
        Room
        <select
          name="roomId"
          value={form.roomId}
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
          required
        >
          <option value="">Select Room</option>
          {rooms.map(room => (
            <option key={room.id} value={room.id}>
              {room.roomNumber} ({room.type})
            </option>
          ))}
        </select>
        {errors.roomId && <span className="text-red-500">{errors.roomId}</span>}
      </label>
      <label className="block mb-2">
        Customer
        <select
          name="customerId"
          value={form.customerId}
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
          required
        >
          <option value="">Select Customer</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>
              {c.username}
            </option>
          ))}
        </select>
        {errors.customerId && <span className="text-red-500">{errors.customerId}</span>}
      </label>
      <label className="block mb-2">
        Check-In
        <input
          type="date"
          name="checkIn"
          value={form.checkIn}
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
          required
        />
        {errors.checkIn && <span className="text-red-500">{errors.checkIn}</span>}
      </label>
      <label className="block mb-2">
        Check-Out
        <input
          type="date"
          name="checkOut"
          value={form.checkOut}
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
          required
        />
        {errors.checkOut && <span className="text-red-500">{errors.checkOut}</span>}
      </label>
      <label className="block mb-2">
        Payment Method
        <select
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
          required
        >
          <option value="CASH">Cash</option>
          <option value="CARD">Card</option>
          <option value="ACCOUNT">Account Balance</option>
        </select>
        {errors.paymentMethod && <span className="text-red-500">{errors.paymentMethod}</span>}
      </label>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Save
      </button>
    </form>
  );
};

export default BookingForm;