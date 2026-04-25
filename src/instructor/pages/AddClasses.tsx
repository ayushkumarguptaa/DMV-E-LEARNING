import { useEffect, useState } from "react";
import axios from "axios";
import "../../index.css";
import { Link } from "react-router-dom";


//types
type CourseClass = {
  id?: number;
  title: string;
  mentor: string;
  mentorImage: string;
  thumbnail: string;
  description: string;
  status: "Upcoming" | "Ongoing" | "Completed";
  startDate: string;
  category: "Data Science" | "Web" | "Design";
  level: "Beginner" | "Intermediate" | "Advanced";
  price: "Free" | "Paid";
  amount: number;          // 🔥 remove optional
  language: "English" | "Hindi";
};


export default function ClassesManager() {
  //empty
  const emptyClass: CourseClass = {
    title: "",
    mentor: "",
    mentorImage: "",
    thumbnail: "",
    description: "",
    status: "Upcoming",
    startDate: "",
    category: "Web",
    level: "Beginner",
    price: "Free",
    amount: undefined,
    language: "English",
  };

  const [formData, setFormData] = useState<CourseClass>(emptyClass);
  const [classes, setClasses] = useState<CourseClass[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  //fetch api
  const fetchClasses = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/instructor/getclasses",
        { withCredentials: true }
      );
      setClasses(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  //handlers
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "price" && value === "Free") {
  setFormData((prev) => ({ ...prev, price: "Free", amount: 0 }));
  return;
}


    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData((prev) => ({
    ...prev,
    amount: Number(e.target.value || 0),
  }));
};


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        thumbnail: reader.result as string,
        mentorImage: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  //save
  const saveClass = async () => {
  if (!formData.title || !formData.mentor || !formData.startDate) return;

  if (formData.price === "Paid" && (!formData.amount || formData.amount <= 0))
    return;

  try {
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && typeof value !== "object") {
        data.append(key, String(value));
      }
    });

    if (imageFile) data.append("thumbnail", imageFile);

    // 🔥 SWITCH BETWEEN ADD & EDIT
    if (editIndex !== null && classes[editIndex].id) {
      // EDIT API
      await axios.put(
        `http://localhost:3000/instructor/edit-class/${classes[editIndex].id}`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    } else {
      // ADD API
      await axios.post(
        "http://localhost:3000/instructor/addclass",
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    }

    setFormData(emptyClass);
    setImageFile(null);
    setEditIndex(null);
    fetchClasses();
  } finally {
    setLoading(false);
  }
};


  //delete
  const deleteClass = async (id?: number) => {
    if (!id) return;
    await axios.delete(
      `http://localhost:3000/instructor/deleteclass/${id}`,
      { withCredentials: true }
    );
    fetchClasses();
  };

  //edit
  const editClass = (index: number) => {
  const cls = classes[index];
  setFormData({
    ...cls,
    amount: cls.amount ?? 0,  // 🔥 guarantee number
  });
  setEditIndex(index);
  setImageFile(null);
};



  const statusColor = (status: CourseClass["status"]) => {
    if (status === "Upcoming") return "bg-blue-100 text-blue-700";
    if (status === "Ongoing") return "bg-green-100 text-green-700";
    return "bg-gray-200 text-gray-700";
  };

  //UI
  return (
    <div className="max-w-6xl mx-auto px-8 pt-14 pb-10 space-y-16">
      {/* FORM */}
      <div className="bg-white px-10 py-8 rounded-3xl shadow-md space-y-8 p-4 mt-4">
        <h2 className="text-3xl font-bold text-purple-600">
          {editIndex !== null ? "Edit Class" : "Add New Class"}
        </h2>

        <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
          <input name="title" placeholder="Class Title" className="form-control" value={formData.title} onChange={handleChange} />
          <input name="mentor" placeholder="Mentor Name" className="form-control" value={formData.mentor} onChange={handleChange} />
          <input type="date" name="startDate" className="form-control" value={formData.startDate} onChange={handleChange} />

          <select name="category" className="form-control" value={formData.category} onChange={handleChange}>
            <option>Data Science</option>
            <option>Web</option>
            <option>Design</option>
          </select>

          <select name="level" className="form-control" value={formData.level} onChange={handleChange}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <select name="language" className="form-control" value={formData.language} onChange={handleChange}>
            <option>English</option>
            <option>Hindi</option>
          </select>

          <select name="price" className="form-control" value={formData.price} onChange={handleChange}>
            <option>Free</option>
            <option>Paid</option>
          </select>

          <select name="status" className="form-control" value={formData.status} onChange={handleChange}>
            <option>Upcoming</option>
            <option>Ongoing</option>
            <option>Completed</option>
          </select>

          {formData.price === "Paid" && (
  <input
    type="number"
    placeholder="Amount ₹"
    className="form-control"
    value={formData.amount}
    onChange={handleAmountChange}
  />
)}

        </div>

        <div className="border-2 rounded-2xl m-3 text-center max-w-md mx-auto">
          <input type="file" className="hidden" id="upload" onChange={handleImageChange} />
          <label htmlFor="upload" className="cursor-pointer text-sm text-gray-500">
            {formData.thumbnail ? (
              <img src={formData.thumbnail} className="mx-auto w-24 h-24 rounded-full object-cover" />
            ) : (
              "Click to upload class image"
            )}
          </label>
        </div>

        <textarea name="description" rows={3} className="mb-3 form-control resize-none" placeholder="Class Description" value={formData.description} onChange={handleChange} />

        <button
  onClick={saveClass}
  disabled={loading}
  className="viewcourses p-2 bg-purple-600 hover:bg-purple-700 px-8 py-2 rounded-full text-white font-medium inline-flex items-center justify-center mx-auto"
>
  {loading ? "Saving..." : editIndex !== null ? "Update Class" : "Add Class"}
</button>


      </div>

      <hr />

      {/* CLASS LIST */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
  {classes.map((cls, index) => (
    <Link
      to={`/instructor/classes/${cls.id}`}
      key={cls.id}
      className="block"
    >
      <div className="bg-white rounded-2xl shadow p-5 hover:shadow-lg transition cursor-pointer">
        <img
          src={cls.thumbnail}
          className="w-24 h-24 rounded-full mx-auto border object-cover"
        />

        <h3 className="text-lg font-bold text-center mt-3">{cls.title}</h3>
        <p className="text-center text-sm text-gray-600">{cls.mentor}</p>

        <p className="text-sm mt-3 line-clamp-3">{cls.description}</p>

        <div className="flex justify-between text-xs mt-3">
          <span className="px-2 py-1 bg-gray-100 rounded">{cls.category}</span>
          <span className="px-2 py-1 bg-gray-100 rounded">{cls.level}</span>
        </div>

        <div className="flex justify-between mt-2 text-sm">
          <span>{cls.language}</span>
          <span className="font-semibold">
            {cls.price === "Free" ? "Free" : `₹${cls.amount}`}
          </span>
        </div>

        <div className="flex justify-between items-center mt-3">
          <span className="text-xs">{cls.startDate}</span>
          <span
            className={`px-3 py-1 rounded-full text-xs ${statusColor(
              cls.status
            )}`}
          >
            {cls.status}
          </span>
        </div>

        {/* Buttons should NOT trigger navigation */}
        <div
          className="flex gap-3 mt-4"
          onClick={(e) => e.preventDefault()}
        >
          <button
            onClick={() => editClass(index)}
            className="flex-1 bg-yellow-500 text-white py-2 rounded-lg"
          >
            Edit
          </button>
          <button
            onClick={() => deleteClass(cls.id)}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </Link>
  ))}
</div>

    </div>
  );
}
