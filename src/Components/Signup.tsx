import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    accepted_terms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.accepted_terms) {
      setError("You must accept Terms & Conditions");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "https://dmv-e-learning-1.onrender.com/user/signup",
        formData,
        { withCredentials: true }
      );

      // ✅ Redirect to login page after successful signup
      navigate("/signin");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT – FORM */}

      {/* LEFT SIDE */}

      <div className="w-full md:w-1/2 flex items-center justify-center px-8">
        <div className="w-full max-w-md">

          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            🎓 DMV <span className="font-normal">Learning</span>
          </h1>

          <p className="text-gray-600 mb-8">
            Create your account to start learning
          </p>

          {error && (
            <p className="text-red-500 text-sm mb-3">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="text"
              name="username"
              placeholder="Enter Full Name"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-purple-600"
            />

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-purple-600"
            />

            <input
              type="password"
              name="password"
              placeholder="Create Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-purple-600"
            />

            {/* TERMS */}
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                name="accepted_terms"
                checked={formData.accepted_terms}
                onChange={handleChange}
                className="mt-1 accent-purple-600"
              />
              <p>
                I agree to the{" "}
                <Link to="/terms" className="text-blue-600 font-semibold">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-blue-600 font-semibold">
                  Privacy Policy
                </Link>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-md font-semibold hover:opacity-90"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-600 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>


      {/* RIGHT – INFO PANEL */}

      {/* RIGHT SIDE PANEL */}

      <div className="hidden md:flex w-1/2 bg-blue-50 items-center justify-center">
        <div className="text-center px-10">
          <h1 className="text-3xl font-semibold mb-6">
            Welcome to DMV <br /> Learning
          </h1>

          <img
            src="../../src/assets/robot.webp"
            alt="AI Bot"
            className="mx-auto w-64 mb-6 rounded-2xl"
          />

          <div className="flex justify-center gap-8 text-gray-600">
            <span>Excellence.</span>
            <span>Community.</span>
            <span>Diversity.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
