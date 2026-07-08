import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      alert("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/forgot-password", {
        email: trimmedEmail,
      });

      alert(res.data.message);
      setEmail("");
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Failed to send reset link"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1220] px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-3">
          Forgot Password
        </h2>

        <p className="text-gray-500 text-center mb-6">
          Enter your registered email address and we'll send you a password
          reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your registered email"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B1220] hover:bg-black text-white py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-blue-600 hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}