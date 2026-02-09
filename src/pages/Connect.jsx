// src/pages/Connect.jsx
import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

import {
  Mail,
  Phone,
  Linkedin,
  Github,
  Twitter,
  User,
  Briefcase,
  Send,
} from "lucide-react";

import { sendMessage } from "../api/UserApi";

const Connect = () => {
  const { theme } = useTheme();

  const [loading, setLoading] = useState(false);

  // 🔥 Toast
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "Interview Call",
    message: "",
  });

  const purposes = [
    "Interview Call",
    "Freelance Project",
    "Internship Opportunity",
    "Collaboration",
    "Other",
  ];

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🔥 Submit + backend message toast
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await sendMessage({
        name: form.name,
        email: form.email,
        phone: form.phone,
        category: form.category,
        message: form.message,
      });
      console.log(response.message)

      showToast(response.success ? "success" : "error", response.message);

      if (response.success) {
        setForm({
          name: "",
          email: "",
          phone: "",
          category: "Interview Call",
          message: "",
        });
      }
    } catch (err) {
      console.log(err);
      showToast("error", "Something went wrong! Try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Toast animation
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fade-slide {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .toast-anim { animation: fade-slide .3s ease-out; }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <>
      {/* 🔥 Center Toast */}
      {toast && (
        <div
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          px-5 py-3 rounded-xl shadow-xl text-sm text-center z-[9999]
          backdrop-blur-md border toast-anim
          ${
            toast.type === "success"
              ? "bg-green-600/90 text-white border-green-300/40"
              : "bg-red-600/90 text-white border-red-300/40"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div
        className={`min-h-screen px-6 py-20 flex items-center justify-center ${theme.bg} ${theme.text}`}
      >
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-14">
          {/* LEFT PANEL */}
          <div className="p-10 rounded-3xl shadow-xl border backdrop-blur-md bg-opacity-10">
            <h1 className={`text-4xl font-bold mb-4 ${theme.accent}`}>
              Let’s Build Something Great
            </h1>

            <p className="opacity-80 mb-10 text-lg leading-relaxed">
              “Opportunities don’t happen — we create them.  
              Reach out for interviews, freelance work, or collaborations.”
            </p>

            <div className="space-y-5">
              <ContactItem
                icon={<Phone size={28} className={theme.accent} />}
                title="Phone"
                value="+91 9361627614"
              />

              <ContactItem
                icon={<Mail size={28} className={theme.accent} />}
                title="Email"
                value="jayaveerapandian18@gmail.com"
              />

              <ContactLink
                href="https://linkedin.com"
                icon={<Linkedin size={28} className={theme.accent} />}
                title="LinkedIn"
                value="/in/developer"
              />

              <ContactLink
                href="https://github.com/Jayaveerapandiandev"
                icon={<Github size={28} className={theme.accent} />}
                title="GitHub"
                value="github.com/developer"
              />

              <ContactLink
                href="https://twitter.com"
                icon={<Twitter size={28} className={theme.accent} />}
                title="Twitter"
                value="@developer"
              />
            </div>
          </div>

          {/* RIGHT PANEL - FORM */}
          <div className="p-10 rounded-3xl shadow-xl border backdrop-blur-md bg-opacity-10">
            <h2 className={`text-3xl font-bold mb-8 ${theme.accent}`}>
              Connect With Me
            </h2>

            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              className="space-y-8"
            >
              <InputField
                name="name"
                label="Full Name"
                icon={<User size={18} />}
                value={form.name}
                onChange={handleChange}
                required
              />

              <InputField
                name="email"
                label="Email Address"
                type="email"
                icon={<Mail size={18} />}
                value={form.email}
                onChange={handleChange}
                required
              />

              <InputField
                name="phone"
                label="Phone (Optional)"
                icon={<Phone size={18} />}
                value={form.phone}
                onChange={handleChange}
              />

              {/* PURPOSE SELECT */}
              <div>
                <label className="block mb-2 font-medium flex items-center gap-2">
                  <Briefcase size={18} /> Purpose
                </label>

                <select
                  name="category"
                  autoComplete="off"
                  value={form.category}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-xl border ${theme.border} ${theme.text}
                  ${
                    theme.bg === "bg-black" || theme.bg === "bg-gray-950"
                      ? "bg-gray-900"
                      : theme.bg === "bg-sky-100" || theme.bg === "bg-purple-100"
                      ? "bg-white/60 backdrop-blur-sm"
                      : theme.bg === "bg-green-950"
                      ? "bg-green-900"
                      : "bg-gray-800"
                  }`}
                >
                  {purposes.map((p) => (
                    <option
                      key={p}
                      value={p}
                      className={`${
                        theme.bg.includes("100")
                          ? "text-gray-800"
                          : "text-white"
                      }`}
                    >
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* MESSAGE */}
              <div>
                <label className="block mb-2 font-medium">Message</label>
                <textarea
                  name="message"
                  autoComplete="off"
                  value={form.message}
                  onChange={handleChange}
                  rows="5"
                  required
                  className={`w-full p-3 rounded-xl bg-transparent border ${theme.border} 
                  focus:ring-2 focus:outline-none ${theme.accent}`}
                  placeholder="Write your message..."
                />
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 shadow-md ${theme.btn}`}
              >
                {loading ? "Sending..." : "Send Message"}
                {!loading && <Send className="inline-block ml-2" size={18} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

/* ============================== */
/* SMALL COMPONENTS BELOW         */
/* ============================== */

const ContactItem = ({ icon, title, value }) => (
  <div className="flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer bg-opacity-20 hover:scale-[1.02] hover:shadow-lg">
    {icon}
    <div>
      <p className="text-sm opacity-70">{title}</p>
      <p className="font-semibold text-lg">{value}</p>
    </div>
  </div>
);

const ContactLink = ({ icon, title, value, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer bg-opacity-20 hover:scale-[1.02] hover:shadow-lg"
  >
    {icon}
    <div>
      <p className="text-sm opacity-70">{title}</p>
      <p className="font-semibold text-lg">{value}</p>
    </div>
  </a>
);

const InputField = ({ name, label, value, onChange, icon, type = "text", required }) => {
  const { theme } = useTheme();
  return (
    <div>
      <label className="block mb-2 font-medium flex items-center gap-2">
        {icon} {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        autoComplete="off"
        required={required}
        className={`w-full p-3 rounded-xl bg-transparent border ${theme.border}
        focus:ring-2 focus:outline-none ${theme.accent}`}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
};

export default Connect;
