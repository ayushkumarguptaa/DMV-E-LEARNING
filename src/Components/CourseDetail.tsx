import { useState, useEffect } from "react";
import Navbar from '../Utilities/Navbar'
import Footer from '../Utilities/Footer'
import axios from "axios";
import '../index.css'
import {useNavigate} from 'react-router-dom'

import { Link, useLocation, useParams } from "react-router-dom";

interface Course {
  id: number;
  name: string;
  description?: string;
  total_lectures?: number;       // ✅ NEW
  total_quizzes?: number; 
  image_url: string;
  level: string;
  price?: number;     // ✅ optional
  type?: string; 
  category: string;
  duration?: string;
  instructor_name?: string;
  certificate_of_completion?: boolean;
  full_lifetime_access?: boolean;
  total_enrollments?: number | string;
}



const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};


export default function CoursePage() {
  const { id: courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [topCourses, setTopCourses] = useState<Course[]>([]);
  const [moreCourses, setMoreCourses] = useState<Course[]>([]);
  const [error, setError] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checking, setChecking] = useState(true);



  // CHECK 

  useEffect(() => {
  if (!courseId) return;

  const checkEnrollment = async () => {
    try {
      const res = await axios.get(
        `https://dmv-e-learning-1.onrender.com/user/is-enrolled/${courseId}`,
        { withCredentials: true } // 🔐 send auth cookie / token
      );

      setIsEnrolled(res.data.enrolled);
    } catch (error) {
      console.error("Failed to check enrollment", error);
      setIsEnrolled(false);
    } finally {
      setChecking(false);
    }
  };

  checkEnrollment();
}, [courseId]);


  /* ================= FETCH COURSE ================= */

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `https://dmv-e-learning-1.onrender.com/user/courses/${courseId}`
        );
        setCourse(res.data.data);
      } catch {
        alert("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  /* ================= TOP ENROLLED COURSES ================= */

  useEffect(() => {
    const fetchTopEnrolledCourses = async () => {
      try {
        const res = await axios.get(
          "https://dmv-e-learning-1.onrender.com/user/courses/top-enrolled"
        );

        const filtered = res.data.data.filter(
  (c: Course) => c.id !== Number(courseId)
);

// ✅ fallback if nothing left
setTopCourses(filtered.length ? filtered : res.data.data);

      } catch {
        setError("Failed to load recommendations");
      }
    };

    fetchTopEnrolledCourses();
  }, [courseId]);

  /* ================= MORE COURSES ================= */

  useEffect(() => {
    const fetchMoreCourses = async () => {
      try {
        const res = await axios.get(
          "https://dmv-e-learning-1.onrender.com/user/courses/top"
        );

        const filtered = res.data.data.filter(
          (c: Course) => c.id !== Number(courseId)
        );

        setMoreCourses(filtered.slice(0, 4));
      } catch {
        console.error("Failed to load more courses");
      }
    };

    fetchMoreCourses();
  }, [courseId]);

  /* ================= ENROLL ================= */

  const handleEnroll = async () => {
    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        alert("Razorpay failed to load");
        return;
      }

      const res = await axios.post(
        "https://dmv-e-learning-1.onrender.com/user/enroll",
        { course_id: courseId },
        { withCredentials: true }
      );

      if (!res.data.order) {
        alert("Enrolled successfully 🎉");
        navigate("/classes");
        return;
      }

      const { order, razorpayKey, course } = res.data;

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: "INR",
        name: "DMV Learning",
        description: course.name,
        order_id: order.id,
        handler: async function (response:any) {
  const res = await axios.post(
    "https://dmv-e-learning-1.onrender.com/user/enroll/verify-payment",
    {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      course_id: courseId,
    },
    { withCredentials: true }
  );

  if (res.data.success) {
    //redirect URL
    navigate(`/classes`);
  }
},
        theme: {
        color: "#7C3AED",
      },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Enrollment failed");
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          Loading course...
        </div>
        <Footer />
      </>
    );
  }

  /* ================= UI ================= */

  return (
    <>
    <Navbar/>
    <div className="bg-slate-100 min-h-screen">

      {/* ================= HERO ================= */}
      <section className="bg-slate-900 text-white p-5">
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10">
          <div>
            <p className="text-purple-400 text-sm mb-2">
              Course / Course Details
            </p>
            <h1 className="text-4xl font-bold mb-4">{course?.name}</h1>

            <p className="text-sm text-slate-300 mb-4">
                Course ID: {courseId}
              </p>

            <div className="flex flex-wrap gap-4 text-sm">
              <span className="bg-purple-600 px-4 py-1 rounded-full">
                By - {course?.instructor_name}
              </span>
              <span>👨‍🎓 {Number(course?.total_enrollments) || 0} students</span>
              {/* <span>⭐ 0 (0 Ratings)</span> */}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              src={course?.image_url}
              alt="course"
              className="w-full h-56 object-cover"
            />
          </div>
        </div>
      </section>

      {/*TABS */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 flex gap-3 py-2">
          {["Overview", "Curriculum", "Instructor", "Reviews"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 rounded-lg font-medium transition ${
                  activeTab === tab
                    ? "bg-purple-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>
      </div>

      {/*CONTENT*/}
      <main className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

        {/* LEFT SIDE */}
        <div className="md:col-span-2 space-y-12 mt-4 mb-4">

          {/*OVERVIEW*/}
          {activeTab === "Overview" && (
            <>
              {/* Description */}
              <section className="bg-white rounded-xl shadow p-4 mb-2">
                <h2 className="text-2xl font-bold mb-4">
                  Course Description
                </h2>
                <p className="text-slate-700 leading-relaxed">
                  {course?.description}
                </p>
              </section>

              
            </>
          )}

          {/*CURRICULUM*/}
          {activeTab === "Curriculum" && (
            <section className="bg-white rounded-xl shadow p-4 mb-2">
              <h2 className="text-2xl font-bold mb-2">
                Course Curriculum
              </h2>
              <p className="text-slate-600">
                {course?.total_lectures} lectures • {course?.total_quizzes} quizzes
              </p>
            </section>
          )}

          {/*INSTRUCTOR*/}
          {activeTab === "Instructor" && (
            <section className="bg-white rounded-xl shadow p-4 mb-2">
              <h2 className="text-2xl font-bold mb-4">
                Instructor
              </h2>
              <p className="font-semibold">{course?.instructor_name}</p>
              <p className="text-slate-600 mt-2">
                Over a decade of experience leading digital transformation
                initiatives.
              </p>
            </section>
          )}

          {/*REVIEWS*/}
          {activeTab === "Reviews" && (
            <section className="bg-white rounded-xl shadow p-4 mb-2">
              <h2 className="text-2xl font-bold mb-4">
                Course Reviews
              </h2>
              <p className="text-slate-600">No reviews found.</p>
            </section>
          )}

          {/* ================= QA ================= */}
          {/* {activeTab === "QA" && (
            <section className="bg-white rounded-xl shadow p-4 mb-2">
              <h2 className="text-2xl font-bold mb-4">
                Questions & Answers
              </h2>
              <p className="text-slate-600">
                No questions have been asked yet.
              </p>
            </section>
          )} */}

          {/*STUDENTS ALSO BOUGHT*/}
          <section className="bg-white rounded-xl shadow p-4 mb-4">
  <h2 className="text-3xl font-bold mb-6">
    Students also bought
  </h2>

  <div className="space-y-4">
    {topCourses.length === 0 && (
  <p className="text-slate-500 text-center">
    No recommendations available.
  </p>
)}

    {topCourses.map((course) => (
      <div
        key={course.id}
        className="grid grid-cols-12 gap-4 items-center border rounded-lg p-4 hover:shadow transition"
      >
        {/* Image */}
        <div className="col-span-2">
          <img
            src={course.image_url}
            alt={course.name}
            className="w-20 h-20 rounded object-cover"
          />
        </div>

        {/* Title & Meta */}
        <div className="col-span-4">
          <h3 className="font-semibold text-lg">
            {course.name}
          </h3>
          <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
            <span className="bg-slate-800 text-white text-xs px-2 py-1 rounded">
              {course.level}
            </span>
            <span>{course.duration || "12 lectures"}</span>
            <span>N/A</span>
          </div>
        </div>

        {/* Rating */}
        {/* <div className="col-span-2 text-center">
          ⭐ 4
        </div> */}

        {/* Students */}
        <div className="col-span-2 text-center text-slate-600">
          👨‍🎓 {course.total_enrollments ?? 0}
        </div>

        {/* Price */}
        <div className="col-span-2 text-purple-600 font-bold">
          {course.price === 0 ? "Free" : `₹${course.price}`}
        </div>
      </div>
    ))}
  </div>
</section>


          {/* MORE COURSES*/}
          <section>
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-3xl font-bold">
      More Courses by Author
    </h2>
    <a href="/courses" className="course-card text-purple-600 font-medium">
      View All →
    </a>
  </div>

  <div className="flex flex-wrap gap-6 p-4">
    {moreCourses.map((c) => (
      <Link
        key={c.id}
        to={`/courses/${c.id}`}
        className="course-card bg-white rounded-xl shadow hover:shadow-lg transition w-[20em]"
      >
        <img
          src={c.image_url}
          alt={c.name}
          className="rounded-t-xl h-40 w-full object-cover"
        />

        <div className="p-4">
          <h4 className="font-semibold text-lg truncate">
            {c.name}
          </h4>
          <p>
            Level: {c.level}
          </p>
          {/* <p>
  Type: {c.type ? c.type : "N/A"}
</p> */}

          {/* <p className="text-sm text-slate-500">
            ⭐ {c.rating ?? 0} • 👨‍🎓 {c.students ?? 0}
          </p> */}

          {/* <p className="mt-3 text-purple-600 font-bold">
  {c.price === 0
    ? "Free"
    : c.price
    ? `₹${c.price.toLocaleString("en-IN")}`
    : "N/A"}
</p> */}
        </div>
      </Link>
    ))}
  </div>
</section>



        </div>

        {/* RIGHT SIDEBAR*/}
        <aside className="bg-white rounded-xl shadow p-6 sticky top-24 h-fit mt-4 p-4 mb-4">
          <h3 className="text-2xl font-bold mb-4">₹{course?.price?.toLocaleString("en-IN")}</h3>

          <button
  onClick={!isEnrolled ? handleEnroll : undefined}
  disabled={isEnrolled}
  className={`w-full py-3 rounded-lg font-semibold mb-6
    ${
      isEnrolled
        ? "bg-green-500 text-white cursor-not-allowed"
        : "bg-purple-600 text-white hover:bg-purple-700"
    }
  `}
>
  {isEnrolled ? "Enrolled" : "Enroll Now"}
</button>



          <ul className="space-y-3 text-sm text-slate-700 mt-4">
            <li className="mb-4">✔ Duration: {course?.duration || "N/A"}</li>
            <li className="mb-4">✔ Lectures: 0 lessons</li>
            <li className="mb-4">✔ Enrolled: {Number(course?.total_enrollments) || 0} students</li>
            <li className="mb-4">✔ Category: {course?.category}</li>
            <li className="mb-4">✔ Language: English</li>
            <li className="mb-4">✔ Skill Level: {course?.level}</li>
            {course?.certificate_of_completion && (
                <li>✔ Certificate of Completion</li>
              )}
            {course?.full_lifetime_access && (
                <li>✔ Full lifetime access</li>
              )}
          </ul>
        </aside>

      </main>
    </div>
    <Footer/>
    </>
  );
}
