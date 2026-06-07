import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";


interface Course {
  id: number;
  name: string;
  category: string;
  description?: string;
  image_url?: string;
}

const InternshipCategories = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  const fetchCourses = async () => {
    try {
      const res = await axios.get("https://dmv-e-learning-1.onrender.com/user/get-courses");

      console.log(res.data); // keep this for debugging

      setCourses(res.data.courses || []);
    } catch (err) {
      setError("Failed to load courses");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  fetchCourses();
}, []);


  if (loading) {
    return (
      <section className="w-full bg-sky-100 p-5 text-center">
        Loading internships...
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-sky-100 p-5 text-center text-red-600">
        {error}
      </section>
    );
  }

  return (
    <section className="w-full bg-gradient-to-b from-sky-200 to-sky-100 p-5">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADING */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
            Having trouble finding Internships to
            <br />
            gain work experience ??
          </h2>

          <p className="mt-4 text-lg text-slate-700">
            The Answer is ?{" "}
            <span className="text-sky-600 font-semibold">
              DMV Learning
            </span>
          </p>
        </div>

        {/* CARDS */}
        <div className="p-4 ml-5 flex flex-wrap justify-between gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {courses.map((course) => (
            <Card key={course.id} style={{ width: "18rem" }}>
              <Card.Img
                variant="top"
                src={
                  course.image_url ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT30hkyUQsrwTRqNZ2d_gDQP0M3l8uCYb-AoWRaekbRK8LBIOAGZKuzfihylNnK3gMsjoCMxqKFMPM0z6XfraYizjEk2QkdetZJcTM2NA&s=10"
                }
                className="h-[10em]"
              />

              <Card.Body>
                <Card.Title>{course.name}</Card.Title>

                {/* <Card.Text>
                  {course.description
                    ? course.description.slice(0, 80) + "..."
                    : `Category: ${course.category}`}
                </Card.Text> */}

                <Link to={`/courses/${course.id}`}>
                  <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </Card.Body>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};

export default InternshipCategories;
