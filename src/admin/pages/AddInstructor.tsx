import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../../index.css";

type Instructor = {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  approval_status: "pending" | "approved" | "rejected";
};

const API_URL = "https://dmv-e-learning-1.onrender.com/instructor";

export default function InstructorApproval() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     Fetch instructors
  ========================= */
  const fetchInstructors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get<{ instructors: Instructor[] }>(
        `${API_URL}/instructors`,
        { withCredentials: true }
      );
      setInstructors(res.data.instructors);
    } catch {
      setError("Failed to load instructors");
    } finally {
      setLoading(false);
    }
  }, []);

  /* =========================
     Update status
  ========================= */
  const updateStatus = async (
    id: number,
    status: "approved" | "rejected"
  ) => {
    try {
      await axios.put(
        `${API_URL}/instructors/${id}/status`,
        { status },
        { withCredentials: true }
      );

      setInstructors((prev) =>
        prev.map((ins) =>
          ins.id === id ? { ...ins, approval_status: status } : ins
        )
      );
    } catch {
      alert("Failed to update status");
    }
  };

  /* =========================
     Delete instructor
  ========================= */
  const deleteInstructor = async (id: number) => {
    if (!window.confirm("Delete this instructor?")) return;

    try {
      await axios.delete(
        `${API_URL}/instructors/${id}`,
        { withCredentials: true }
      );

      setInstructors((prev) =>
        prev.filter((ins) => ins.id !== id)
      );
    } catch {
      alert("Failed to delete instructor");
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]); // ✅ correct dependency

  if (loading) return <p>Loading instructors...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-container">
      <h2>Instructor Management</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Specialization</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {instructors.map((ins) => (
            <tr key={ins.id}>
              <td>{ins.name}</td>
              <td>{ins.email}</td>
              <td>{ins.phone}</td>
              <td>{ins.specialization}</td>
              <td className={`status ${ins.approval_status}`}>
                {ins.approval_status}
              </td>
              <td>
                {ins.approval_status === "pending" && (
                  <>
                    <button
                      className="approve"
                      onClick={() => updateStatus(ins.id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="reject"
                      onClick={() => updateStatus(ins.id, "rejected")}
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  className="delete"
                  onClick={() => deleteInstructor(ins.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
