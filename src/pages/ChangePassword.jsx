// src/pages/ChangePassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, CheckCircle, AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";
import { changePassword } from "../api/UserApi";
import { useTheme } from "../context/ThemeContext";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
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

    if (formData.newPassword !== formData.confirmPassword) {
      setStatus({
        loading: false,
        success: false,
        message: "❌ New password and confirm password do not match.",
      });
      return;
    }

    setStatus({ loading: true, success: null, message: "" });

    try {
      const res = await changePassword({
        userId: localStorage.getItem("userId"),
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      if (res.success) {
        setStatus({
          loading: false,
          success: true,
          message: res.message || "Password updated successfully.",
        });

        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setStatus({
          loading: false,
          success: false,
          message: res.message || "Failed to change password.",
        });
      }
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        message:
          err.response?.data?.message ||
          "An unexpected error occurred while changing the password.",
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
          <KeyRound size={32} className={`${theme.accent} mr-2`} />
          <h1 className={`text-2xl font-bold ${theme.accent}`}>Change Password</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Old, New, Confirm Password Inputs */}
          {[
            {
              label: "Old Password",
              name: "oldPassword",
              type: "password",
              placeholder: "Enter your old password",
            },
            {
              label: "New Password",
              name: "newPassword",
              type: "password",
              placeholder: "Enter a new password",
            },
            {
              label: "Confirm New Password",
              name: "confirmPassword",
              type: "password",
              placeholder: "Re-enter new password",
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
            className={`w-full font-semibold py-2 rounded-md flex items-center justify-center gap-2 transition ${theme.btn}`}
          >
            {status.loading && <Loader2 size={18} className="animate-spin" />}
            {status.loading ? "Updating..." : "Change Password"}
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

export default ChangePassword;
