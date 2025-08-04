import React, { useState } from "react";

const UserForm = ({ initialData = {}, onSubmit, isEdit = false, users = [] }) => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "CUSTOMER",
    ...initialData,
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.username) errs.username = "Username is required";
    if (!isEdit && users.some(u => u.username === form.username)) {
      errs.username = "Username must be unique";
    }
    if (!isEdit && !form.password) errs.password = "Password is required";
    if (!form.role) errs.role = "Role is required";
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
      <h3 className="text-lg font-bold mb-2">{isEdit ? "Edit User" : "Add User"}</h3>
      <label className="block mb-2">
        Username
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
          placeholder="Username"
          required
        />
        {errors.username && <span className="text-red-500">{errors.username}</span>}
      </label>
      <label className="block mb-2">
        Password
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
          placeholder={isEdit ? "Leave blank to keep current password" : "Password"}
          required={!isEdit}
        />
        {errors.password && <span className="text-red-500">{errors.password}</span>}
      </label>
      <label className="block mb-2">
        Role
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
          required
        >
          <option value="CUSTOMER">Customer</option>
          <option value="ADMIN">Admin</option>
        </select>
        {errors.role && <span className="text-red-500">{errors.role}</span>}
      </label>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Save
      </button>
    </form>
  );
};

export default UserForm;