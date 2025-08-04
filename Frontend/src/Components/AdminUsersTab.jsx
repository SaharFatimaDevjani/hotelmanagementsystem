import React, { useEffect, useState } from "react";
import API from "../Services/api";

const emptyUser = { username: "", password: "", role: "CUSTOMER" };

const AdminUsersTab = () => {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyUser);

  // Fetch users on mount
  useEffect(() => {
    API.get("/users")
      .then(res => setUsers(res.data))
      .catch(console.error);
  }, []);

  // Edit user
  const handleEdit = user => {
    setEditing(user.id);
    setForm({ ...user, password: "" }); // Don't show hashed password
  };

  // Delete user
  const handleDelete = id => {
    API.delete(`/users/${id}`)
      .then(() => setUsers(users.filter(u => u.id !== id)))
      .catch(console.error);
  };

  // Add new user
  const handleAddNew = () => {
    setEditing("new");
    setForm(emptyUser);
  };

  // Handle form submit for add/edit
  const handleSubmit = e => {
    e.preventDefault();
    if (editing === "new") {
      API.post("/users/admin", form)
        .then(() => window.location.reload())
        .catch(console.error);
    } else {
      API.put(`/users/${editing}`, form)
        .then(() => window.location.reload())
        .catch(console.error);
    }
  };

  return (
    <div>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        onClick={handleAddNew}
      >
        Add New User
      </button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {users.map(user => (
          <div key={user.id} className="p-4 border rounded-lg shadow bg-gray-50">
            <div><b>Username:</b> {user.username}</div>
            <div><b>Role:</b> {user.role}</div>
            <div className="mt-2 flex space-x-2">
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => handleEdit(user)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <form className="mt-8 p-4 border rounded-lg bg-white" onSubmit={handleSubmit}>
          <h3 className="text-lg font-bold mb-2">{editing === "new" ? "Add User" : "Edit User"}</h3>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            required
            onChange={e => setForm({ ...form, username: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            required={editing === "new"}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            className="border p-2 mb-2 w-full"
          >
            <option value="CUSTOMER">Customer</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            Save
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminUsersTab;