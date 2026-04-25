import { useEffect, useState } from "react";
import axios from "axios";
import "../index.css";

interface Course {
  id: number;
  name: string;
  category: string;
  students?: number;
  image_url: string;
  level?: string;
  instructor_name?: string;
}

const TopCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopCourses = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/user/courses/top"
        );

        setCourses(res.data.data); // 👈 backend should return { data: [] }
      } catch (err) {
        setError("Failed to load top courses");
      } finally {
        setLoading(false);
      }
    };

    fetchTopCourses();
  }, []);

  if (loading) {
    return (
      <section className="bg-sky-100 py-20 text-center">
        Loading top courses...
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-sky-100 py-20 text-center text-red-600">
        {error}
      </section>
    );
  }

  return (
    <>
      <section className="bg-sky-100 py-20 p-5">
        <div className="max-w-7xl mx-auto px-6">

          {/* HEADER */}
          <div className="bg-slate-700 rounded-3xl flex items-center justify-between p-4 mb-5">
            <h2 className="text-4xl font-bold text-white">
              Top Online Courses
            </h2>

            <a href="/courses">
              <button className="viewcourses bg-white text-slate-700 font-medium hover:bg-gray-100 transition p-2">
                All Courses
              </button>
            </a>
          </div>

          {/* COURSES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl shadow-md overflow-hidden"
              >
                {/* IMAGE */}
                <div className="relative h-56 bg-slate-200">
                  <img
                    src={course.image_url}
                    alt={course.name}
                    className="w-full h-full object-cover"
                  />

                  {/* FLOATING INFO */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-700 text-white rounded-full flex gap-6 text-sm shadow-lg p-3">
                    <span className="border-2 px-3 py-1 rounded-xl bg-white text-black">
                      {course.level || "Beginner"}
                    </span>
                    <span className="border-2 px-3 py-1 rounded-xl bg-white text-black">
                      N/A
                    </span>
                    <span className="border-2 px-3 py-1 rounded-xl bg-white text-black">
                      {course.students ?? 0} students
                    </span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-5 mt-6">
                  {/* Instructor */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      🎓
                    </div>
                    <div>
                      <p className="font-semibold">Instructor: {course.instructor_name || "Super Admin"}</p>

                      <div className="text-orange-400 text-sm">
                        ★★★★★
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mb-2">
                    in: {course.category}
                  </p>

                  <h3 className="text-xl font-bold text-gray-800">
                    {course.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
};

export default TopCourses;
