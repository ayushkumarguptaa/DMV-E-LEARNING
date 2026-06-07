import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../Utilities/Navbar";
import Footer from "../Utilities/Footer";
import "../index.css";

type Lecture = {
  id: number;
  lecture_title: string;
  lecture_url: string;
};

export default function UserCourseLectures() {
  const [courseDescription, setCourseDescription] = useState<string>("");

  const { courseId } = useParams();
  const location = useLocation();
  const classTitle = location.state?.classTitle || "Course";

  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
  const fetchCourseDescription = async () => {
    try {
      const res = await axios.get(
        "https://dmv-e-learning-1.onrender.com/user/get-courses"
      );

      const course = res.data.data.find(
        (c: any) => String(c.id) === String(courseId)
      );

      if (course) {
        setCourseDescription(course.description);
      }
    } catch (err) {
      console.error("Failed to fetch course description", err);
    }
  };

  fetchCourseDescription();
}, [courseId]);



  /* ================= FETCH USER RATING ================= */
  const fetchUserRating = async (lectureId: number) => {
    try {
      const res = await axios.get(
        `https://dmv-e-learning-1.onrender.com/user/lecture/rating/${lectureId}`,
        { withCredentials: true }
      );

      setRating(res.data.rating || 0);
    } catch {
      setRating(0);
    }
  };

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const res = await axios.get(
          `https://dmv-e-learning-1.onrender.com/user/lectures/${courseId}`,
          { withCredentials: true }
        );

        const data = res.data.data || [];
        setLectures(data);

        if (data.length > 0) {
          setActiveLecture(data[0]);
          fetchUserRating(data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch lectures", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, [courseId]);

  const submitRating = async () => {
    if (!activeLecture || rating === 0) return;

    try {
      setSubmitting(true);

      await axios.post(
        "https://dmv-e-learning-1.onrender.com/user/lecture/rate",
        {
          lecture_id: activeLecture.id,
          rating,
        },
        { withCredentials: true }
      );

      alert("Rating submitted successfully ⭐");
    } catch (err) {
      console.error("Rating error", err);
      alert("Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= UI ================= */
  return (
    <>
      <Navbar />

      <div className="bg-slate-100 min-h-screen">
        {/* HEADER */}
        <header className="bg-slate-900 text-white px-4 py-5">
          <h1 className="text-2xl font-bold">
            {classTitle} – Lectures
          </h1>
          <p className="text-slate-300 text-sm">
            Course ID: {courseId}
          </p>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          {loading ? (
            <p className="text-center">Loading lectures...</p>
          ) : lectures.length === 0 ? (
            <p className="text-center">No lectures available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

              {/* VIDEO + RATING */}
              <section className="md:col-span-8 bg-white rounded-xl shadow p-4 mt-4 mb-4">
                {activeLecture && (
                  <>
                    <div className="aspect-video bg-black rounded overflow-hidden">
                      <video
                        src={activeLecture.lecture_url}
                        controls
                        controlsList="nodownload"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <h3 className="mt-3 font-semibold">
                      {activeLecture.lecture_title}
                    </h3>

                    {/* ⭐ RATING UI */}
                    <div className="mt-4">
                      <p className="font-medium mb-1">
                        Rate this lecture
                      </p>

                      <div className="flex gap-2 text-3xl">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isActive = star <= rating;
                          const blink = rating > 0 && isActive;

                          return (
                            <button
                              key={star}
                              onClick={() => setRating(star)}
                              className={`
                                ${isActive ? "text-yellow-400" : "text-gray-300"}
                                ${blink ? "blink-star" : ""}
                              `}
                            >
                              ★
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={submitRating}
                        disabled={submitting || rating === 0}
                        className="mt-3 bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
                      >
                        {submitting ? "Submitting..." : "Submit Rating"}
                      </button>
                    </div>
                  </>
                )}
              </section>

              {/* PLAYLIST */}
              <aside className="mb-4 mt-4 md:col-span-4 bg-white rounded-xl shadow p-4 md:sticky md:top-4 h-fit">
                <h2 className="text-lg font-bold mb-3">
                  📂 Course Lectures
                </h2>

                <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
                  {lectures.map((lecture) => (
                    <li
                      key={lecture.id}
                      onClick={() => {
                        setActiveLecture(lecture);
                        fetchUserRating(lecture.id);
                      }}
                      className={`mb-2 p-3 rounded cursor-pointer ${
                        activeLecture?.id === lecture.id
                          ? "bg-purple-600 text-white"
                          : "bg-slate-100 hover:bg-slate-200"
                      }`}
                    >
                      ▶ {lecture.lecture_title}
                    </li>
                  ))}
                </ul>
                
              </aside>

            </div>
          )}
          {/* 🔽 COURSE DESCRIPTION */}
  {courseDescription && (
    <div className="mt-4 pt-3 border-t">
      <h3 className="font-semibold mb-1">📘 About this course</h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        {courseDescription}
      </p>
    </div>
  )}
        </main>
        
      </div>

      <Footer />
    </>
  );
}
