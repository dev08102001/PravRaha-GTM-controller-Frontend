import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

import logo from "../assets/logo.png";
import signupVideo from "../assets/video.mp4";

export default function Signup() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    company: "",
    designation: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/register",
        formData
      );

      toast.success(
        response.data.message ||
          "Registration Successful"
      );

      navigate("/login");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0B1220]">

      {/* Left Section */}
      <div className="relative w-1/2 border-r border-gray-800 overflow-hidden">

        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={signupVideo} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 h-full flex flex-col justify-center px-20">

          <div className="flex items-center gap-4 mb-10">

            <img
              src={logo}
              alt="PravRaha"
              className="w-16 h-16 object-contain"
            />

            <div>
              <h2 className="text-4xl font-bold text-white">
                PravRaha
              </h2>

              <p className="text-gray-300 text-sm">
                AI Revenue Agent Platform
              </p>
            </div>

          </div>

          <h1 className="text-5xl font-bold text-white mb-6">
            Welcome to PravRaha
          </h1>

          <p className="text-gray-200 text-xl leading-relaxed max-w-lg">
            Start turning buying signals into predictable
            revenue with AI-powered GTM intelligence.
          </p>

        </div>

      </div>

      {/* Right Section */}
      <div className="w-1/2 bg-[#151D2E] overflow-y-auto">

        <div className="min-h-screen flex items-center justify-center py-10">

          <div className="w-full max-w-xl px-8">

            <h1 className="text-5xl font-bold text-center mb-2 text-white">
              Create Your Account
            </h1>

            <p className="text-center text-gray-400 mb-8">
              Register to access PravRaha Dashboard
            </p>

            <form
              onSubmit={handleSignup}
              className="space-y-4"
            >

              <div className="grid grid-cols-2 gap-4">

                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="bg-[#1C2538] border border-gray-700 rounded-lg p-4 text-white placeholder-gray-400"
                />

                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="bg-[#1C2538] border border-gray-700 rounded-lg p-4 text-white placeholder-gray-400"
                />

              </div>

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#1C2538] border border-gray-700 rounded-lg p-4 text-white placeholder-gray-400"
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-[#1C2538] border border-gray-700 rounded-lg p-4 text-white placeholder-gray-400"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-[#1C2538] border border-gray-700 rounded-lg p-4 text-white placeholder-gray-400"
              />

              <input
                type="text"
                name="company"
                placeholder="Company Name"
                value={formData.company}
                onChange={handleChange}
                className="w-full bg-[#1C2538] border border-gray-700 rounded-lg p-4 text-white placeholder-gray-400"
              />

              <input
                type="text"
                name="designation"
                placeholder="Designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full bg-[#1C2538] border border-gray-700 rounded-lg p-4 text-white placeholder-gray-400"
              />

              <div className="flex items-center gap-3 text-gray-300">
                <input type="checkbox" />
                <span>
                  I want to receive PravRaha newsletters
                </span>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <input type="checkbox" required />
                <span>
                  I agree to the Terms and Privacy Policy
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl text-xl font-semibold transition disabled:opacity-50"
              >
                {loading
                  ? "Creating Account..."
                  : "Sign Up"}
              </button>

            </form>

            <div className="text-center mt-6 text-gray-300">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-red-400 hover:text-red-300"
              >
                Login
              </Link>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}