import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../index.css";

export default function InstructorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://dmv-e-learning-1.onrender.com/instructor/login",
        { email, password },
        { withCredentials: true }
      );

      // 🔁 Redirect logic
      if (res.data.instructor?.is_first_login) {
        navigate("/instructor/change-password");
      } else {
        navigate("/instructor");
      }
    } catch (err: any) {
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="instructor-login-wrapper">
      <form className="login-card" onSubmit={submit}>
        <h2>Instructor Login</h2>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="info-text">
          Only approved instructors can log in
        </p>
      </form>
    </div>
  );
}
