import { useNavigate } from "react-router-dom";
import "../../index.css";

export default function InstructorHome() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <h1>Welcome to the Instructor Panel 🎓</h1>
        <p>
          Create classes, manage courses, and conduct live sessions — all in one
          powerful platform.
        </p>

        {!isLoggedIn && (
          <button
            className="hero-btn"
            onClick={() => navigate("/instructor/getstarted")}
          >
            Get Started →
          </button>
        )}
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features">
        <div className="feature-card">
          📚
          <h3>Add Classes</h3>
          <p>Create and manage your teaching classes easily.</p>
        </div>

        <div className="feature-card">
          🎥
          <h3>Live Streaming</h3>
          <p>Engage students with real-time interactive sessions.</p>
        </div>

        <div className="feature-card">
          🧠
          <h3>Courses</h3>
          <p>Design structured courses with videos and quizzes.</p>
        </div>
      </section>
    </div>
  );
}
