import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import Navbar from '../Utilities/Navbar'
import Footer from '../Utilities/Footer'
import '../index.css'
import { Link } from "react-router-dom";

const InstructorDetails = () => {
  const courses = [
    {
      id: 1,
      title: "Web Development",
      level: "Intermediate",
      rating: "5 (3 Rating)",
      students: 408,
      price: "₹0.00",
      image: "/assets/web-dev.png",
    },
    {
      id: 2,
      title: "UI/UX Design",
      level: "Beginner",
      rating: "5 (1 Rating)",
      students: 280,
      price: "₹0.00",
      image: "/assets/uiux.png",
    },
    {
      id: 3,
      title: "Data Science",
      level: "Intermediate",
      rating: "0 (0 Rating)",
      students: 343,
      price: "₹0.00",
      image: "/assets/data-science.png",
    },
  ];

  return (
    <>
    <Navbar/>
    <div className="bg-white min-h-screen">

      {/* HERO */}
      <section className="bg-slate-900 text-white py-20 text-center p-3">
        <h1 className="text-4xl font-bold">Learn More About Your Instructor</h1>
        {/* <p className="mt-3 text-slate-300">Home / Instructor Details</p> */}
      </section>

      {/* INSTRUCTOR INFO */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-10 p-5">

        {/* IMAGE */}
        <div className=" justify-center">
          <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center">
            🎓
          </div>
          {/* SOCIAL */}
          <div className="flex gap-4 mt-4">
            <a href="#" className="social"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a href="#" className="social"><FontAwesomeIcon icon={faTwitter} /></a>
            <a href="#" className="social"><FontAwesomeIcon icon={faInstagram} /></a>
            <a href="#" className="social"><FontAwesomeIcon icon={faLinkedinIn} /></a>
          </div>
        </div>

        {/* DETAILS */}
        <div className="md:col-span-2 space-y-4">
          {/* <h2 className="text-3xl font-bold">Super admin</h2>
          <p className="text-gray-600">Administrator</p> */}

          
          

          {/* STATS */}
          <div className="grid grid-cols-3 gap-6 mt-8 text-center">
            <div>
              <p className="font-bold text-xl">726</p>
              <p className="text-sm text-gray-500">Students</p>
            </div>
            <div>
              <p className="font-bold text-xl">Web</p>
              <p className="text-sm text-gray-500">Category</p>
            </div>
            <div>
              <p className="font-bold text-xl">⭐⭐⭐⭐⭐</p>
              <p className="text-sm text-gray-500">5/5 (4 ratings)</p>
            </div>
          </div>

          {/* DESCRIPTION */}
          <p className="mt-6 text-gray-700 leading-relaxed">
            As the Super Admin of our platform, I bring over a decade of
            experience in managing and leading digital transformation
            initiatives. My journey began as a developer and evolved into
            a strategic leader focused on innovation and operational excellence.
          </p>
        </div>
      </section>

      {/* MORE COURSES */}
      <section className="max-w-7xl mx-auto px-6 py-16 mb-5">
        <h2 className="text-4xl font-bold text-center mb-12 mb-5">
          More Courses by Author
        </h2>

        <div className="flex flex-wrap md:grid-cols-3 gap-8 p-3 pl-5">
          {courses.map((course) => (
            <Link
            to={`/courses/${course.id}`}
            key={item.id}
            className="bg-white rounded-xl shadow overflow-hidden hover:scale-[1.02] transition course-card"
          >
                <div
              key={course.id}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition w-95"
            >
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                📘
              </div>

              <div className="p-4 space-y-2">
                <span className="inline-block bg-purple-600 text-white text-xs px-3 py-1 rounded">
                  {course.level}
                </span>

                <h3 className="text-lg font-semibold">{course.title}</h3>

                <p className="text-sm text-gray-500">
                  ⭐ {course.rating} • 👨‍🎓 {course.students} Students
                </p>

                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-purple-600 font-bold">
                    {course.price}
                  </span>
                  🛒
                </div>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
    <Footer/>
    </>
  );
};

export default InstructorDetails;
