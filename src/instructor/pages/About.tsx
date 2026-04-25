import { useEffect, useState } from "react";
import axios from "axios";
import "../../index.css";

type Instructor = {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  approval_status: "pending" | "approved" | "rejected";
  is_first_login: boolean;
  created_at: string;
  linkedin_url?: string;
  twitter_url?: string;
  github_url?: string;
};

export default function About() {
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    specialization: "",
    linkedin_url: "",
    twitter_url: "",
    github_url: "",
  });

  useEffect(() => {
    fetchInstructor();
  }, []);

  useEffect(() => {
    if (instructor) {
      setFormData({
        name: instructor.name,
        phone: instructor.phone,
        specialization: instructor.specialization,
        linkedin_url: instructor.linkedin_url || "",
        twitter_url: instructor.twitter_url || "",
        github_url: instructor.github_url || "",
      });
    }
  }, [instructor]);

  const fetchInstructor = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/instructor/instructor-details",
        { withCredentials: true }
      );
      setInstructor(res.data.instructor);
    } catch (error) {
      console.error("Failed to fetch instructor:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(
        "http://localhost:3000/instructor/update-profile",
        formData,
        { withCredentials: true }
      );
      setInstructor(res.data.instructor);
      setEditMode(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading profile...</p>;
  if (!instructor)
    return <p style={{ textAlign: "center" }}>No instructor data found</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Instructor"
          />
          <span className={`status ${instructor.approval_status}`}>
            {instructor.approval_status}
          </span>
        </div>

        <div className="profile-body">
          {!editMode ? (
            <>
              <h3>{instructor.name}</h3>
              <p className="qualification">{instructor.specialization}</p>

              <div className="info">
                <p>
                  <strong>Email:</strong> {instructor.email}
                </p>
                <p>
                  <strong>Phone:</strong> {instructor.phone}
                </p>
                <p>
                  <strong>Specialization:</strong> {instructor.specialization}
                </p>
                <p>
                  <strong>First Login:</strong>{" "}
                  {instructor.is_first_login ? "Yes" : "No"}
                </p>
              </div>

              <div className="social-links">
                {instructor.linkedin_url && (
                  <a
                    href={instructor.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn
                  </a>
                )}
                {instructor.twitter_url && (
                  <a
                    href={instructor.twitter_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Twitter
                  </a>
                )}
                {instructor.github_url && (
                  <a
                    href={instructor.github_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                )}
              </div>

              <button className="edit-btn" onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
              />

              <input
                type="text"
                name="specialization"
                placeholder="Specialization"
                value={formData.specialization}
                onChange={handleChange}
              />

              <input
                type="text"
                name="linkedin_url"
                placeholder="LinkedIn URL"
                value={formData.linkedin_url}
                onChange={handleChange}
              />

              <input
                type="text"
                name="twitter_url"
                placeholder="Twitter URL"
                value={formData.twitter_url}
                onChange={handleChange}
              />

              <input
                type="text"
                name="github_url"
                placeholder="GitHub URL"
                value={formData.github_url}
                onChange={handleChange}
              />

              <div className="edit-actions">
                <button className="save-btn" onClick={handleSave}>
                  Save
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
