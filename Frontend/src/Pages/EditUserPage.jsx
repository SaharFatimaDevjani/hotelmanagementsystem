import React, { useEffect, useState } from "react";
import API from "../Services/api";
import UserForm from "../Components/UserForm";
import { useNavigate, useParams } from "react-router-dom";

const EditUserPage = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    API.get("/users").then(res => setUsers(res.data));
    API.get(`/users/${id}`).then(res => setUser(res.data));
  }, [id]);

  const handleSubmit = (form) => {
    API.put(`/users/${id}`, form)
      .then(() => navigate("/admin"))
      .catch(console.error);
  };

  if (!user) return <div className="p-8 text-center">Loading...</div>;
  return (
    <div className="max-w-xl mx-auto mt-8">
      <UserForm initialData={user} onSubmit={handleSubmit} isEdit users={users} />
    </div>
  );
};

export default EditUserPage;