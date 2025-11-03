import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/UserApi";
import { Eye, EyeOff, Lock, User, ArrowLeft } from "lucide-react";
import { useTheme } from "../context/ThemeContext"; // Access theme context

const AdminLogin = () => {
  const [formData, setFormData] = useState({ userid: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme(); // Directly access theme values (bg, text, btn, etc.)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        userId: formData.userid,
        password: formData.password,
        ipAddress: window.location.hostname,
        userAgent: navigator.userAgent,
      };

      const data = await loginUser(payload);

      if (data.success) {
        setMessage("✅ Login successful!");
        localStorage.setItem("sessionId", data.sessionId);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);
        window.location.href = "/admin/dashboard";
      } else {
        setMessage(`❌ ${data.message || "Login failed"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${theme.bg} ${theme.text} transition-colors duration-500`}
    >
      <div
        className={`w-full max-w-md border rounded-2xl p-8 shadow-2xl transition-transform duration-300 hover:-translate-y-1 ${theme.border}`}
      >
        <div className="flex flex-col items-center mb-6">
          <Lock className={`${theme.accent} mb-3`} size={42} />
          <h2 className={`text-2xl font-bold ${theme.accent} tracking-wide`}>
            Admin Login
          </h2>
          <p className="text-sm opacity-70 mt-1">
            Secure access to your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          {/* USER ID */}
          <div>
            <label className="block text-sm font-medium opacity-80 mb-1">
              User ID
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-2.5 opacity-60" />
              <input
                type="text"
                name="userid"
                value={formData.userid}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 rounded-md bg-transparent border outline-none transition 
                  ${theme.text} ${theme.border} focus:${theme.accent} focus:ring-1 placeholder-gray-500`}
                placeholder="Enter your user ID"
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium opacity-80 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-2.5 opacity-60" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-2 rounded-md bg-transparent border outline-none transition 
                  ${theme.text} ${theme.border} focus:${theme.accent} focus:ring-1 placeholder-gray-500`}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-2.5 opacity-60 hover:${theme.accent} transition`}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md font-semibold transition duration-200 ${
              loading
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : theme.btn
            }`}
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>

        {/* ACTION LINKS */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <button
            onClick={() => navigate("/")}
            className={`flex items-center gap-1 opacity-70 hover:${theme.accent} transition`}
          >
            <ArrowLeft size={14} />
            Back to Home
          </button>

          <button
            onClick={() => navigate("/forgot-password")}
            className={`${theme.accent} hover:opacity-80 transition`}
          >
            Forgot Password?
          </button>
        </div>

        {/* MESSAGE */}
        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.includes("✅") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
