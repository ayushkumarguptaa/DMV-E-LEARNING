import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../Utilities/Navbar";
import Footer from "../Utilities/Footer";
import "../index.css";

/*TYPES*/
type ClassItem = {
  id: number;
  title: string;
  mentor: string;
  category: "Design" | "Data" | "Web";
  level: "Beginner" | "Intermediate" | "Advance" | "Pro";
  price: "Free" | "Paid";
  amount?: number;
  language: "English" | "Hindi";
  startDate: string;
};

/* COMPONENT*/
export default function ClassesPage() {
  const [classesData, setClassesData] = useState<ClassItem[]>([]);
  const [filters, setFilters] = useState({
    category: "",
    level: "",
    price: "",
    language: "",
  });

  /*FETCH COURSES*/
  const fetchClasses = async () => {
  try {
    const res = await axios.get(
      "https://dmv-e-learning-1.onrender.com/user/enrolled-courses",
      { withCredentials: true }
    );

    if (!res.data.data || res.data.data.length === 0) {
      setClassesData([]);
      return;
    }

    const formatted = res.data.data.map((item: any) => ({
      id: item.id,
      title: item.name,
      mentor: "Super Admin",
      category: item.category,
      level: item.level,
      price: item.type,
      amount: item.type === "Paid" ? Number(item.price) : undefined,
      language: "English",
      startDate: item.enrolled_at,
    }));

    setClassesData(formatted);
  } catch (error) {
    console.error("Failed to fetch enrolled classes", error);
    setClassesData([]);
  }
};


  useEffect(() => {
    fetchClasses();
  }, []);

  /* ================= FILTER LOGIC ================= */
  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      level: "",
      price: "",
      language: "",
    });
  };

  const filteredClasses = classesData.filter((cls) => {
    return (
      (!filters.category || cls.category === filters.category) &&
      (!filters.level || cls.level === filters.level) &&
      (!filters.price || cls.price === filters.price) &&
      (!filters.language || cls.language === filters.language)
    );
  });

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  /*UI*/
  return (
    <>
      <Navbar />

      <div>
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white text-center px-4 py-8">
          <h1 className="text-3xl md:text-5xl font-extrabold">
            Browse Our Classes
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 m-5">
          {/* FILTERS */}
          <aside className="space-y-6 p-3 mt-4">
            <div className="space-y-6 mt-1">
            <FilterBox title="Category">
              {["Design", "Data", "Web"].map((v) => (
                <div className="mt-1">
                  <Radio
                  key={v}
                  label={v}
                  name="category"
                  value={v}
                  checked={filters.category === v}
                  onChange={handleFilterChange}
                />
                </div>
              ))}
            </FilterBox></div>
            
              <div className="space-y-6 mt-5">
            <FilterBox title="Level">
              {["Pro", "Advance", "Intermediate", "Beginner"].map((v) => (
                <div className="mt-1">
                  <Radio
                  key={v}
                  label={v}
                  name="level"
                  value={v}
                  checked={filters.level === v}
                  onChange={handleFilterChange}
                />
                </div>
              ))}
            </FilterBox></div>
              <div className="space-y-6 mt-5">
            <FilterBox title="Price">
              {["Paid", "Free"].map((v) => (
                <div className="mt-1">
                  <Radio
                  key={v}
                  label={v}
                  name="price"
                  value={v}
                  checked={filters.price === v}
                  onChange={handleFilterChange}
                />
                </div>
              ))}
            </FilterBox>
            </div>
              <div className="space-y-6 mt-5">
            <FilterBox title="Language">
              {["English", "Hindi"].map((v) => (
                <div className="mt-1">
                  <Radio
                  key={v}
                  label={v}
                  name="language"
                  value={v}
                  checked={filters.language === v}
                  onChange={handleFilterChange}
                />
                </div>
              ))}
            </FilterBox>
            </div>

            <button
              onClick={clearFilters}
              className="mt-1 w-full border border-purple-600 text-purple-600 py-2 rounded-lg hover:bg-purple-50"
            >
              Clear Filters
            </button>
          </aside>

          {/* CLASSES */}
          <main className="lg:col-span-3">
            <p className="mb-6 text-gray-600">
              {filteredClasses.length} Classes found
            </p>

            {filteredClasses.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="text-6xl">🔍</div>
                <h2 className="text-2xl font-semibold mt-4">
                  No Class Found
                </h2>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredClasses.map((cls) => (
                  <Link
                    key={cls.id}
                    to={`/classes/lectures/${cls.id}`}
                    state={{ classTitle: cls.title }}
                    className="sidebar rounded-xl p-5 shadow bg-white hover:shadow-lg transition"
                  >
                    <h3 className="font-semibold text-lg">{cls.title}</h3>

                    <p className="text-sm mt-1">
                      Mentor: <span className="font-medium">{cls.mentor}</span>
                    </p>

                    <p className="text-sm text-gray-600">
                      Category: {cls.category}
                    </p>
                    <p className="text-sm text-gray-600">
                      Level: {cls.level}
                    </p>
                    <p className="text-sm text-gray-600">
                      Language: {cls.language}
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      Start Date:{" "}
                      <span className="font-medium">
                        {formatDate(cls.startDate)}
                      </span>
                    </p>

                    <p className="mt-3 font-semibold text-purple-600">
                      {cls.price === "Free" ? "Free" : `₹${cls.amount}`}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
}

/*REUSABLE*/
function FilterBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-xl p-4 bg-white space-y-3">
      <h3 className="font-semibold text-lg">{title}</h3>
      {children}
    </div>
  );
}

function Radio({
  label,
  name,
  value,
  checked,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        checked={checked}
        onChange={() => onChange(name, value)}
        className="accent-purple-600"
      />
      <span>{label}</span>
    </label>
  );
}
