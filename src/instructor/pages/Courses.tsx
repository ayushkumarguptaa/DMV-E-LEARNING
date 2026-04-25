import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import "../../index.css";

interface Course {
  id: number;
  name: string;
  level: string;
  category: string;
  type: string;
  price: string;
  status?: string;
  imagePreview: string | null;
  description?: string;
  duration?: string;
  total_lectures?: number;
  total_quizzes?: number;
  certificate_of_completion?: boolean;
  full_lifetime_access?: boolean;
}


const AddCourse = () => {
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    level: "",
    category: "",
    type: "",
    price: "",
    duration: "",
    total_lectures: "",
    total_quizzes: "",
    certificate_of_completion: false,
    full_lifetime_access: false,
    image: null as File | null,
  });

  const [courses, setCourses] = useState<Course[]>([]);

  /* ================= FETCH COURSES ================= */
  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/instructor/getcourses",
        { withCredentials: true }
      );

      const formatted = res.data.data.map((item: any) => ({
  id: item.id,
  name: item.name,
  level: item.level,
  category: item.category,
  type: item.type,
  price: item.price,
  status: item.status,
  imagePreview: item.image_url,
  description: item.description || "",   // <-- important
  duration: item.duration,
  total_lectures: item.total_lectures,
  total_quizzes: item.total_quizzes,
  certificate_of_completion: item.certificate_of_completion,
  full_lifetime_access: item.full_lifetime_access,
}));



      setCourses(formatted);
    } catch (error) {
      console.error("Failed to fetch courses", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files, type, checked } =
      e.target as HTMLInputElement;

    if (name === "imageUrl" && files) {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ================= EDIT ================= */
  const handleEditCourse = (course: Course) => {
    setEditId(course.id);
    setFormData({
      name: course.name,
      description: course.description || "",
      level: course.level,
      category: course.category,
      type: course.type,
      price: course.price,
      duration: course.duration || "",
      total_lectures: String(course.total_lectures || ""),
      total_quizzes: String(course.total_quizzes || ""),
      certificate_of_completion: course.certificate_of_completion || false,
      full_lifetime_access: course.full_lifetime_access || false,
      image: null,
    });
  };

  /* ================= DELETE ================= */
  const handleDeleteCourse = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await axios.delete(
        `http://localhost:3000/instructor/deletecourse/${id}`,
        { withCredentials: true }
      );
      fetchCourses();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("level", formData.level);
      data.append("category", formData.category);
      data.append("type", formData.type);
      data.append("price", formData.type === "Paid" ? formData.price : "0");
      data.append("duration", formData.duration || "N/A");
      data.append("total_lectures", formData.total_lectures || "0");
      data.append("total_quizzes", formData.total_quizzes || "0");
      data.append(
        "certificate_of_completion",
        String(formData.certificate_of_completion)
      );
      data.append(
        "full_lifetime_access",
        String(formData.full_lifetime_access)
      );

      if (formData.image) {
        data.append("imageUrl", formData.image); // MUST be imageUrl
      }

      if (editId) {
        await axios.put(
          `http://localhost:3000/instructor/course/${editId}`,
          data,
          { withCredentials: true }
        );
        alert("Course updated successfully");
      } else {
        await axios.post(
          "http://localhost:3000/instructor/addcourse",
          data,
          { withCredentials: true }
        );
        alert("Course added successfully");
      }

      setEditId(null);
      setFormData({
        name: "",
        description: "",
        level: "",
        category: "",
        type: "",
        price: "",
        duration: "",
        total_lectures: "",
        total_quizzes: "",
        certificate_of_completion: false,
        full_lifetime_access: false,
        image: null,
      });

      fetchCourses();
    } catch (error) {
      console.error("Add/Edit failed", error);
      alert("Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#fff7f0] p-5 space-y-10">
      {/* FORM */}
      <div className="bg-white p-8 rounded-lg shadow mb-4 p-5">
        <h2 className="text-3xl font-bold mb-6">
          {editId ? "Edit Course" : "Add New Course"}
        </h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Course Name"
            className="border p-3 rounded"
            required
          />

          {/* IMPORTANT: name MUST be imageUrl */}
          <input type="file" name="imageUrl" onChange={handleChange} />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Course Description"
            className="border p-3 rounded"
            required
          />

          <input
            name="level"
            value={formData.level}
            onChange={handleChange}
            placeholder="Level"
            className="border p-3 rounded"
          />

          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            className="border p-3 rounded"
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="border p-3 rounded"
          >
            <option value="">Select Type</option>
            <option>Free</option>
            <option>Paid</option>
          </select>

          {formData.type === "Paid" && (
            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="border p-3 rounded"
            />
          )}

          <input
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Duration"
            className="border p-3 rounded"
          />

          <input
            name="total_lectures"
            value={formData.total_lectures}
            onChange={handleChange}
            placeholder="Total Lectures"
            className="border p-3 rounded"
          />

          <input
            name="total_quizzes"
            value={formData.total_quizzes}
            onChange={handleChange}
            placeholder="Total Quizzes"
            className="border p-3 rounded"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="certificate_of_completion"
              checked={formData.certificate_of_completion}
              onChange={handleChange}
            />
            <label>Certificate of Completion</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="full_lifetime_access"
              checked={formData.full_lifetime_access}
              onChange={handleChange}
            />
            <label>Full Lifetime Access</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 text-white p-3 rounded w-40"
          >
            {loading ? "Saving..." : editId ? "Update Course" : "Add Course"}
          </button>
        </form>
      </div>

      {/* COURSE LIST */}
      <div className="grid md:grid-cols-3 gap-6">
  {courses.map((course) => (
    <div
      key={course.id}
      className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
    >
      {course.imagePreview && (
        <img
          src={course.imagePreview}
          className="h-40 w-full object-cover"
          alt={course.name}
        />
      )}

      <div className="p-4 space-y-1">
        <h4 className="font-bold text-lg">{course.name}</h4>

         {/* Description */}
  <p className="text-sm text-gray-600">
    <span className="font-semibold text-gray-800">Description:</span>{" "}
    {course.description
      ? course.description.length > 80
        ? course.description.substring(0, 80) + "..."
        : course.description
      : "No description"}
  </p>

        <p>
          <span className="font-semibold">Level:</span> {course.level}
        </p>

        <p>
          <span className="font-semibold">Category:</span> {course.category}
        </p>

        <p>
          <span className="font-semibold">Price:</span>{" "}
          {course.type === "Free" ? "Free" : `₹${course.price}`}
        </p>

        <p>
          <span className="font-semibold">Status:</span>{" "}
          <span
            className={`px-2 py-1 rounded text-sm ${
              course.status === "approved"
                ? "bg-green-100 text-green-700"
                : course.status === "rejected"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {course.status || "pending"}
          </span>
        </p>

        <p>
          <span className="font-semibold">Certificate:</span>{" "}
          {course.certificate_of_completion ? "Yes" : "No"}
        </p>

        <p>
          <span className="font-semibold">Lifetime Access:</span>{" "}
          {course.full_lifetime_access ? "Yes" : "No"}
        </p>

        <p>
    <span className="font-semibold">Total Lectures:</span>{" "}
    {course.total_lectures ?? 0}
  </p>

  <p>
    <span className="font-semibold">Total Quizzes:</span>{" "}
    {course.total_quizzes ?? 0}
  </p>

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => handleEditCourse(course)}
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            Edit
          </button>

          <button
            onClick={() => handleDeleteCourse(course.id)}
            className="bg-red-500 text-white px-4 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

    </div>
  );
};

export default AddCourse;
