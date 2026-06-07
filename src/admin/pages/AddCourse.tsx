import { useEffect, useState } from "react";
import axios from "axios";
import "../../index.css";

type Course = {
  id: number;
  name: string;
  image_url?: string;
  category: string;
  level: string;
  type: "Free" | "Paid";
  price: string;
};

export default function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const deleteCourse = async (id: number) => {
  if (!window.confirm("Are you sure you want to delete this course?")) return;

  try {
    await axios.delete(`https://dmv-e-learning-1.onrender.com/admin/courses/${id}`);
    // Remove deleted course from UI without refetching
    setCourses((prev) => prev.filter((course) => course.id !== id));
  } catch (error) {
    console.error("Delete Course Error:", error);
    alert("Failed to delete course");
  }
};


  // Fetch all courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://dmv-e-learning-1.onrender.com/admin/courses");

      /*
        Your backend response is:
        {
          success: true,
          data: [...]
        }
        So we must take res.data.data
      */
      setCourses(res.data.data || []);
    } catch (err) {
      console.error("Fetch Courses Error:", err);
      setError("Failed to load courses");
      setCourses([]); // always keep array to avoid .length crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading courses...
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
    <div className="max-w-6xl mx-auto px-8 pt-10 pb-12">
      <h2 className="text-3xl font-bold text-purple-600 text-center mb-10">
        All Courses
      </h2>

      {courses.length === 0 ? (
        <p className="text-center text-gray-500">
          No courses found
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {courses.map((course) => (
    <div
      key={course.id}
      className="bg-white rounded-2xl shadow p-5 hover:shadow-lg transition relative"
    >
      <img
        src={course.image_url || "/no-image.png"}
        alt={course.name}
        className="w-full h-40 object-cover rounded-xl"
      />

      <h3 className="text-lg font-bold mt-4">
        {course.name}
      </h3>

      <p className="text-sm text-gray-600 mt-1">
        {course.category} • {course.level}
      </p>

      <div className="flex justify-between items-center mt-3">
        <span className="px-3 py-1 text-xs rounded-full bg-gray-100">
          {course.type}
        </span>

        <span className="font-semibold text-purple-600">
          {course.type === "Free" ? "Free" : `₹${course.price}`}
        </span>
      </div>

      {/* DELETE BUTTON */}
      <button
        onClick={() => deleteCourse(course.id)}
        className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium"
      >
        Delete
      </button>
    </div>
  ))}
</div>

      )}
    </div>
  );
}
