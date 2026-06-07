import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../Utilities/Navbar";
import Footer from "../Utilities/Footer";
import "../index.css";

type Course = {
  id: number;
  name: string;
  image_url?: string;
  category: "Design" | "Data" | "Web";
  level: "Beginner" | "Intermediate" | "Advanced";
  type: "Free" | "Paid";
  price: string;
};

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: "",
    level: "",
    price: "",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          "https://dmv-e-learning-1.onrender.com/user/get-courses"   // backend API
        );
        setCourses(res.data.courses);  // FIXED
      } catch (error) {
        console.error("Fetch Courses Error:", error);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((item) => {
    return (
      (!filters.category || item.category === filters.category) &&
      (!filters.level || item.level === filters.level) &&
      (!filters.price || item.type === filters.price)
    );
  });

  return (
    <>
      <Navbar />

      <div className="w-full bg-gray-50 mt-2">
        <section className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white text-center px-4 py-8">
          <h1 className="text-3xl md:text-5xl font-extrabold">
            Join the Millions for Better Learning Experience
          </h1>
        </section>

        <section className="m-5">
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full bg-purple-600 text-white py-2 rounded-lg"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters */}
            <aside
              className={`${showFilters ? "block" : "hidden"} lg:block lg:sticky lg:top-28`}
            >
              <div className="space-y-6 mt-5">
                <FilterBox title="Category">
                  {["Design", "Data", "Web"].map((cat) => (
                    <div key={cat}>
                      <Radio
                        label={cat}
                        checked={filters.category === cat}
                        onChange={() =>
                          setFilters({ ...filters, category: cat })
                        }
                      />
                    </div>
                  ))}
                </FilterBox>

                <FilterBox title="Level">
                  {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
                    <div key={lvl}>
                      <Radio
                        label={lvl}
                        checked={filters.level === lvl}
                        onChange={() =>
                          setFilters({ ...filters, level: lvl })
                        }
                      />
                    </div>
                  ))}
                </FilterBox>

                <FilterBox title="Price">
                  {["Free", "Paid"].map((p) => (
                    <div key={p}>
                      <Radio
                        label={p}
                        checked={filters.price === p}
                        onChange={() =>
                          setFilters({ ...filters, price: p })
                        }
                      />
                    </div>
                  ))}
                </FilterBox>

                <button
                  onClick={() =>
                    setFilters({ category: "", level: "", price: "" })
                  }
                  className="w-full border border-purple-600 text-purple-600 py-2 rounded-lg hover:bg-purple-50"
                >
                  Clear Filters
                </button>
              </div>
            </aside>

            {/* Courses */}
            <div className="lg:col-span-3 mb-3">
              <p className="mb-6 text-gray-600">
                {filteredCourses.length} Courses found
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((item) => (
                  <Link
                    key={item.id}
                    to={`/courses/${item.id}`}
                    className=" course-card bg-white rounded-xl shadow overflow-hidden hover:scale-[1.02] transition"
                  >
                    <div
                      className="h-40 flex items-center justify-center text-white font-bold bg-cover bg-center"
                      style={{
                        backgroundImage: item.image_url
                          ? `url(${item.image_url})`
                          : "linear-gradient(to right, #6366f1, #8b5cf6)",
                      }}
                    >
                      {item.name}
                    </div>

                    <div className="p-5">
                      <span className="text-sm bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
                        {item.level}
                      </span>

                      <h3 className="font-bold mt-3">{item.name}</h3>

                      <div className="flex justify-between text-sm text-gray-500 mt-4">
                        <span>Category: {item.category}</span>
                        <span>Type: {item.type}</span>
                      </div>

                      <div className="flex justify-between items-center mt-6">
                        <span className="font-bold text-purple-600">
                          {item.type === "Free" ? "₹0.00" : `₹${item.price}`}
                        </span>
                        <span className="text-purple-600 text-xl">→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};
function FilterBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4 m-3">
      <h3 className="font-bold mb-4">{title}</h3>
      {children}
    </div>
  );
}
function Radio({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex gap-2 mb-2 text-gray-600 cursor-pointer">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="accent-purple-600"
      />
      {label}
    </label>
  );
}


export default Courses;