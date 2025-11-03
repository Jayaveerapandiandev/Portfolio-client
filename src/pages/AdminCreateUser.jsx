import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import { registerUser } from "../api/UserApi";
import { useTheme } from "../context/ThemeContext";

const AdminCreateUser = () => {
  const navigate = useNavigate();
  const { theme, themeName } = useTheme();

  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    name: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    success: null,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, message: "" });

    try {
      const data = await registerUser({
        userId: formData.userId,
        password: formData.password,
        name: formData.name,
      });

      if (data.success) {
        setStatus({
          loading: false,
          success: true,
          message:
            data.message || `User "${data.userId}" created successfully.`,
        });
        setFormData({ userId: "", password: "", name: "" });
      } else {
        let errorMsg = data.message || "Failed to create user.";
        if (
          errorMsg.toLowerCase().includes("already exists") ||
          errorMsg.toLowerCase().includes("user id already")
        ) {
          errorMsg = "⚠️ User ID already exists. Please choose a different one.";
        }

        setStatus({
          loading: false,
          success: false,
          message: errorMsg,
        });
      }
    } catch (err) {
      console.error("Error creating user:", err);
      setStatus({
        loading: false,
        success: false,
        message:
          err.response?.data?.message ||
          "An unexpected error occurred while creating the user.",
      });
    }
  };

  return (
    <div
      className={`min-h-screen ${theme.bg} ${theme.text} flex items-center justify-center px-4`}
    >
      <div
        className={`p-8 rounded-2xl shadow-lg border w-full max-w-md bg-gray-900 ${theme.border}`}
      >
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <UserPlus size={32} className={`${theme.accent} mr-2`} />
          <h1 className={`text-2xl font-bold ${theme.accent}`}>
            Create New User
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            {
              label: "User ID",
              name: "userId",
              type: "text",
              placeholder: "Enter unique user ID",
            },
            {
              label: "Password",
              name: "password",
              type: "password",
              placeholder: "Enter password",
            },
            {
              label: "Full Name",
              name: "name",
              type: "text",
              placeholder: "Enter full name",
            },
          ].map((input) => (
            <div key={input.name}>
              <label className="block text-sm text-gray-400 mb-1">
                {input.label}
              </label>
              <input
                type={input.type}
                name={input.name}
                value={formData[input.name]}
                onChange={handleChange}
                required
                placeholder={input.placeholder}
                className={`w-full px-3 py-2 rounded-md border bg-gray-800 text-gray-100 border-gray-700 focus:border-current outline-none`}
              />
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status.loading}
            className={`w-full font-semibold py-2 rounded-md transition ${theme.btn}`}
          >
            {status.loading ? "Creating..." : "Create User"}
          </button>
        </form>

        {/* Status Message */}
        {status.message && (
          <div
            className={`mt-4 flex items-center justify-center gap-2 text-sm ${
              status.success ? "text-green-400" : "text-red-400"
            }`}
          >
            {status.success ? (
              <CheckCircle size={18} />
            ) : (
              <AlertTriangle size={18} />
            )}
            <span>{status.message}</span>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/dashboard")}
          className={`mt-6 flex items-center justify-center gap-2 w-full py-2 rounded-md transition border ${theme.border} ${theme.text} hover:${theme.accent}`}
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AdminCreateUser;
