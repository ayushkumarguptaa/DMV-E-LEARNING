import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../index.css";

type FormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ChangePassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e: React.FormEvent) => {
  e.preventDefault();
  setMessage("");
  setError("");

  if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
    setError("All fields are required");
    return;
  }

  if (form.newPassword !== form.confirmPassword) {
    setError("New passwords do not match");
    return;
  }

  if (form.newPassword.length < 8) {
    setError("Password must be at least 8 characters");
    return;
  }

  try {
    setLoading(true);

    const res = await axios.put(
      "http://localhost:3000/instructor/change-password",
      {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      },
      {
        withCredentials: true,
      }
    );

    setMessage(res.data.message || "Password changed successfully");

    setForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setTimeout(() => {
      navigate("/instructor/");
    }, 1500);
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to change password");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="change-password-wrapper">
      <form className="change-password-card" onSubmit={submit}>
        <h2>Change Password</h2>

        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Change Password"}
        </button>

        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}
      </form>
    </div>
  );
}
