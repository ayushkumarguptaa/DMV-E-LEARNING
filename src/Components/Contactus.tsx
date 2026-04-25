import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import "../index.css";
import Footer from "../Utilities/Footer";
import Navbar from "../Utilities/Navbar";

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export default function ContactUs() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:3000/user/contact",
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
        {
          withCredentials: true,
        }
      );

      alert("Thank you for contacting us!");
      setFormData({ name: "", email: "", message: "" });

    } catch (error) {
      console.error("Contact submit error:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-5">
          
          {/* Heading */}
          <h2 className="text-3xl font-bold text-center text-purple-600 mb-2">
            Contact Us
          </h2>
          <p className="text-center text-gray-500 mb-8">
            We’d love to hear from you. Please fill out the form below.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your email"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Write your message here..."
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className=" w-full bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition p-3"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
