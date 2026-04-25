import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../index.css";
import Footer from "../../Utilities/Footer";

export default function InstructorLayout() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check login status using cookie
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        await axios.get("http://localhost:3000/instructor/me", {
          withCredentials: true,
        });
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Logout: backend clears the cookie
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/instructor/ins-logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout failed:", error);
    }

    setIsLoggedIn(false);
    navigate("/instructor");
  };

  // Avoid UI flicker while checking auth
  if (loading) return null;

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <header className="navbar">
        <div className="logo">Instructor Panel</div>

        <nav className="nav-links">
          <span onClick={() => navigate("/instructor/")}>Home</span>
          <span onClick={() => navigate("/instructor/about")}>About</span>
          <span onClick={() => navigate("/instructor/dashboard")}>Dashboard</span>
          <span onClick={() => navigate("/instructor/add-classes")}>
            Add Classes
          </span>
          {/* <span onClick={() => navigate("/instructor/notes")}>
            Notes
          </span> */}
          <span onClick={() => navigate("/instructor/add-courses")}>
            Add Courses
          </span>
          <span onClick={() => navigate("/instructor/add-quizzes")}>
            Add Quizzes
          </span>
          <span onClick={() => navigate("/instructor/live")}>
            Live Streaming
          </span>
        </nav>

        <div className="auth-buttons">
          {!isLoggedIn ? (
            <>
              <button
                className="btn-outline"
                onClick={() => navigate("/instructor/login")}
              >
                Sign In
              </button>
              <button
                className="btn-primary"
                onClick={() => navigate("/instructor/register")}
              >
                Sign Up
              </button>
            </>
          ) : (
            <button className="btn-danger" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </header>

      {/* All pages will render here */}
      <Outlet />

      <Footer />
    </>
  );
}
