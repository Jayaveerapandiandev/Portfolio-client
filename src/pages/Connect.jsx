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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await sendMessage(form);
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
      showToast("error", "Something went wrong! Try again.");
    } finally {
      setLoading(false);
    }
  };

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
      {toast && <Toast toast={toast} />}

      <div
        className={`min-h-screen px-4 sm:px-6 py-14 sm:py-20 flex items-center justify-center ${theme.bg} ${theme.text}`}
      >
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14">
          {/* LEFT */}
          <GlassCard>
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
          </GlassCard>

          {/* RIGHT */}
          <GlassCard>
            <h2 className={`text-3xl font-bold mb-8 ${theme.accent}`}>
              Connect With Me
            </h2>

            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              className="space-y-6 sm:space-y-8"
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

              <SelectField
                label="Purpose"
                icon={<Briefcase size={18} />}
                value={form.category}
                onChange={handleChange}
                options={purposes}
              />

              <TextArea
                value={form.message}
                onChange={handleChange}
              />

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 shadow-md ${theme.btn}`}
              >
                {loading ? "Sending..." : "Send Message"}
                {!loading && (
                  <Send className="inline-block ml-2" size={18} />
                )}
              </button>
            </form>
          </GlassCard>
        </div>
      </div>
    </>
  );
};

/* ============================== */
/* REUSABLE COMPONENTS            */
/* ============================== */

const GlassCard = ({ children }) => (
  <div className="p-6 sm:p-10 rounded-3xl shadow-xl border backdrop-blur-md bg-opacity-10">
    {children}
  </div>
);

const Toast = ({ toast }) => (
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
);

const ContactItem = ({ icon, title, value }) => (
  <div className="flex items-center gap-4 p-5 rounded-2xl border bg-opacity-20 transition-all hover:scale-[1.02] hover:shadow-lg min-w-0">
    {icon}
    <div className="min-w-0">
      <p className="text-sm opacity-70">{title}</p>
      <p className="font-semibold text-base sm:text-lg break-all sm:break-words">
        {value}
      </p>
    </div>
  </div>
);

const ContactLink = ({ icon, title, value, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="flex items-center gap-4 p-5 rounded-2xl border bg-opacity-20 transition-all hover:scale-[1.02] hover:shadow-lg min-w-0"
  >
    {icon}
    <div className="min-w-0">
      <p className="text-sm opacity-70">{title}</p>
      <p className="font-semibold text-base sm:text-lg break-all sm:break-words">
        {value}
      </p>
    </div>
  </a>
);

const InputField = ({
  name,
  label,
  value,
  onChange,
  icon,
  type = "text",
  required,
}) => {
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
        required={required}
        autoComplete="off"
        className={`w-full p-3 rounded-xl bg-transparent border ${theme.border}
        focus:ring-2 focus:outline-none ${theme.accent}`}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
};

const SelectField = ({ label, icon, value, onChange, options }) => {
  const { theme } = useTheme();
  return (
    <div>
      <label className="block mb-2 font-medium flex items-center gap-2">
        {icon} {label}
      </label>
      <select
        name="category"
        value={value}
        onChange={onChange}
        className={`w-full p-3 rounded-xl border ${theme.border} ${theme.text}
        ${
          theme.bg.includes("100")
            ? "bg-white/60 backdrop-blur-sm"
            : "bg-gray-900"
        }`}
      >
        {options.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </div>
  );
};

const TextArea = ({ value, onChange }) => {
  const { theme } = useTheme();
  return (
    <div>
      <label className="block mb-2 font-medium">Message</label>
      <textarea
        name="message"
        rows="5"
        required
        value={value}
        onChange={onChange}
        className={`w-full p-3 rounded-xl bg-transparent border ${theme.border}
        focus:ring-2 focus:outline-none ${theme.accent}`}
        placeholder="Write your message..."
      />
    </div>
  );
};

export default Connect;
