import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    await axios.post(
      "http://localhost:3000/user/login",
      {
        email: form.email,
        password: form.password,
      },
      { withCredentials: true }
    );

    //Redirect to home page
    navigate("/");
  } catch (err: any) {
    setError(err.response?.data?.error || "Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* LEFT – LOGIN FORM */}
      <div className="flex items-center justify-center px-10">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <span className="text-3xl">🎓</span>
            <h1 className="text-2xl font-bold">
              DMV <span className="font-normal">Learning</span>
            </h1>
          </div>

          <h2 className="text-2xl font-semibold mb-6">
            Welcome back. Please login<br />to your account
          </h2>

          {/* ERROR MESSAGE */}
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Enter Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-purple-600"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Enter Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-purple-600"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition mt-4"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Register */}
          <p className="text-sm text-center mt-4">
            Don’t have an account?{" "}
            <a href="/signup" className="text-purple-600 font-medium">
              Register
            </a>
          </p>

        </div>
      </div>

      {/* RIGHT*/}
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 to-sky-100 px-10 text-center">

        <h2 className="text-4xl font-bold mb-10">
          Welcome to DMV<br />Learning
        </h2>

        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
          alt="Learning"
          className="w-80 mb-10"
        />

        <div className="flex gap-12 text-gray-700 font-medium">
          <span>Excellence.</span>
          <span>Community.</span>
          <span>Diversity.</span>
        </div>

      </div>
    </div>
  );
};

export default SignIn;
