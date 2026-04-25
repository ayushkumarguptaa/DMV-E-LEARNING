import { useParams, Link } from "react-router-dom";
import Navbar from '../Utilities/Navbar'
import Footer from '../Utilities/Footer'

const classesData = [
  {
    id: 1,
    title: "Data Analytics",
    category: "Data",
    level: "Beginner",
    price: "Free",
    students: 286,
    rating: 5,
    description:
      "Learn the fundamentals of data analytics, data cleaning, visualization, and real-world use cases.",
  },
  {
    id: 2,
    title: "HTML, CSS & JavaScript",
    category: "Web",
    level: "Beginner",
    price: "Free",
    students: 185,
    rating: 4,
    description:
      "Build modern responsive websites using HTML, CSS, and JavaScript from scratch.",
  },
  {
    id: 3,
    title: "Java Full Stack",
    category: "Web",
    level: "Intermediate",
    price: "Paid",
    students: 291,
    rating: 5,
    description:
      "Master Java, Spring Boot, React, databases, and build full stack applications.",
  },
  {
    id: 4,
    title: "UI/UX",
    category: "Web",
    level: "Begineeer",
    price: "Free",
    students: 278,
    rating: 5,
    description:
      "Build modern responsive websites using HTML, CSS, and JavaScript from scratch.",
  },
  {
    id: 5,
    title: "Data Science",
    category: "Data Science",
    level: "Intermediate",
    price: "Paid",
    students: 342,
    rating: 5,
    description:
      "Master Java, Spring Boot, React, databases, and build full stack applications.",
  },
  {
    id: 6,
    title: "Web Development",
    category: "Web",
    level: "Intermediate",
    price: "Free",
    students: 405,
    rating: 5,
    description:
      "Master Java, Spring Boot, React, databases, and build full stack applications.",
  },
];

export default function CourseDetails() {
  const { id } = useParams();

  const course = classesData.find(
    (course) => course.id === Number(id)
  );

  if (!course) {
    return (
      <div className="text-center mt-20 text-xl font-semibold">
        Course not found
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="max-w-6xl mx-auto px-6 py-12 pt-5 pb-5 mt-5 mb-5">
      <Link
  to={`/courses/${course.id}`}
  state={{ titleName: course.title, courseId: course.id }}
  className="text-purple-600 font-medium hover:underline course-card pb-5"
>
        to="/courses"
        className="text-purple-600 font-medium hover:underline course-card pb-5"
        ← Back to Courses
      </Link>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-64 rounded-xl flex items-center justify-center text-white text-3xl font-bold">
          {course.title}
        </div>

        {/* RIGHT */}
        <div>
          <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
            {course.level}
          </span>

          <h1 className="text-4xl font-bold mt-4">
            {course.title}
          </h1>

          <p className="text-gray-600 mt-4">
            {course.description}
          </p>

          <div className="flex gap-6 mt-6 text-gray-600">
            <span>Rating: {course.rating}</span>
            <span>Enrolled Students:  {course.students}</span>
            <span>Technology: {course.category}</span>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <span className="text-3xl font-bold text-purple-600">
              {course.price === "Free" ? "₹0.00" : "₹999.00"}
            </span>

            <button className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 addcourse-btn p-2">
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
