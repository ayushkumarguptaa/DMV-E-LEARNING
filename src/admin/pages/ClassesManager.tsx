import { useEffect, useState } from "react";
import axios from "axios";
import "../../index.css";

type ClassType = {
  id: number;
  title: string;
  mentor: string;
  startDate: string;
  category: string;
  level: string;
  price: string;
  amount: number;
  language: string;
  status: string;
  thumbnail: string;
  description: string;
  created_at: string;
  updated_at: string;
  instructor_id: number;
};

export default function AdminClasses() {
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all classes
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://dmv-e-learning-1.onrender.com/admin/classes");

      /*
        Backend response:
        {
          success: true,
          total: number,
          data: [...]
        }
      */
      setClasses(res.data.data || []);
    } catch (err) {
      console.error("Fetch Classes Error:", err);
      setError("Failed to load classes");
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Delete class
  const deleteClass = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this class?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://dmv-e-learning-1.onrender.com/admin/deleteclass/${id}`);
      // Remove deleted class from UI
      setClasses((prev) => prev.filter((cls) => cls.id !== id));
    } catch (error) {
      console.error("Delete Class Error:", error);
      alert("Failed to delete class");
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading classes...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">
        {error}
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 pt-10 pb-12">
      <h2 className="text-3xl font-bold text-purple-600 text-center mb-10">
        All Classes (Admin)
      </h2>

      {classes.length === 0 ? (
        <p className="text-center text-gray-500">
          No classes found
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-white rounded-2xl shadow p-5 hover:shadow-lg transition"
            >
              <img
                src={cls.thumbnail || "/no-image.png"}
                alt={cls.title}
                className="w-full h-40 object-cover rounded-xl"
              />

              <h3 className="text-lg font-bold mt-4">{cls.title}</h3>
              <p className="text-sm text-gray-600">{cls.mentor}</p>

              <p className="text-xs text-gray-500 mt-1">
                {cls.category} • {cls.level}
              </p>

              <p className="text-sm mt-2 line-clamp-2">
                {cls.description}
              </p>

              <div className="flex justify-between items-center mt-3 text-sm">
                <span>{cls.language}</span>
                <span className="font-semibold text-purple-600">
                  {cls.price === "Free" ? "Free" : `₹${cls.amount}`}
                </span>
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {new Date(cls.startDate).toLocaleDateString()}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    cls.status === "Upcoming"
                      ? "bg-blue-100 text-blue-700"
                      : cls.status === "Ongoing"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {cls.status}
                </span>
              </div>

              {/* DELETE BUTTON */}
              <button
                onClick={() => deleteClass(cls.id)}
                className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium"
              >
                Delete Class
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
