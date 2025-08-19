import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
  const LoginForm = () => {
      const apiUrl = import.meta.env?.VITE_REACT_APP_BASE_URL;

   const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });


  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setMessage("");
  setIsLoading(true);

  console.log("Username:", formData.username);
  console.log("Password:", formData.password);

  try {
    const res = await axios.post(`${apiUrl}/user/login`, formData);

    localStorage.setItem("token", res.data.token);
    console.log("Token:", res.data.token); // Corrected

    navigate("/home");
  } catch (error) {
    setMessage(error.response?.data?.message || "Login failed");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      {message && <p className="mb-4 text-red-600">{message}</p>}
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
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          className="w-full border border-gray-400 px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded"
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? "Logging in..." : "Login"} {/* Show loading text */}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
