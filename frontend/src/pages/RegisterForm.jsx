// src/components/RegisterForm.jsx
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const RegisterForm = () => {
    const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

   const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const [message, setMessage] = useState("");
   const navigate=useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(`${apiUrl}/user/register`, formData);
    setMessage(res.data.message);

    // Set flag in localStorage to allow login
    localStorage.setItem("adminRegistered", "true");

    // Redirect to login page
    navigate("/login");
  } catch (error) {
    setMessage(error.response?.data?.error || "Registration failed");
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      {message && <p className="mb-4 text-blue-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          onChange={handleChange}
          className="w-full border border-gray-400 px-3 py-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
          className="w-full border border-gray-400 px-3 py-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          className="w-full border border-gray-400 px-3 py-2"
        />
        <select
          name="role"
          onChange={handleChange}
          className="w-full border border-gray-400 px-3 py-2"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="employee">Employee</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
