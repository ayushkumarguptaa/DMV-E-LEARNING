import axios from "axios";
import { useState } from "react";
import "../../index.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "https://dmv-e-learning-1.onrender.com/instructor/register",
        form,
        {
          withCredentials: true,
        }
      );

      alert("Registration successful! Wait for admin approval.");

      setForm({
        name: "",
        email: "",
        phone: "",
        specialization: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="instructor-register-wrapper">
      <form className="register-card" onSubmit={submit}>
        <h2>Instructor Registration</h2>

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter full name"
            required
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
          />
        </div>

        <div className="form-group">
          <label>Specialization</label>
          <input
            type="text"
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            placeholder="e.g. Driving Rules, Traffic Signs"
            required
          />
        </div>

        <button
          type="submit"
          className="register-btn"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="info-text">
          Your account will be activated after admin approval.
        </p>
      </form>
    </div>
  );
}
