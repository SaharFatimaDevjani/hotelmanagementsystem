import React, { useEffect, useState } from "react";
import API from "../Services/api";
import UserForm from "../Components/UserForm";
import { useNavigate } from "react-router-dom";

const AddUserPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/users").then(res => setUsers(res.data));
  }, []);

  const handleSubmit = (form) => {
    API.post("/users/admin", form)
      .then(() => navigate("/admin"))
      .catch(console.error);
  };

  return <UserForm onSubmit={handleSubmit} users={users} />;
};

export default AddUserPage;