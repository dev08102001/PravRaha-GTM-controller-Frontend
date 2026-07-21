import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedPassword = password.trim();

    if (!trimmedPassword) {
      toast.error("Please enter a new password.");
      return;
    }

    if (trimmedPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (trimmedPassword !== confirmPassword.trim()) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/reset-password", {
        token,
        password: trimmedPassword,
      });

      toast.success(res.data.message);

      navigate("/login");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Password reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1220] px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-3">
          Reset Password
        </h2>

        <p className="text-gray-500 text-center mb-6">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B1220] hover:bg-black text-white py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}