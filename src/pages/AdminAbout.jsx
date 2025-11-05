import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { getAbout, updateAbout } from "../api/UserApi";
import {
  Loader2,
  Save,
  UploadCloud,
  FileUp,
  User,
  Mail,
  Eye,
  Download,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const AdminAbout = () => {
  const { themeName, theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    fullName: "",
    role: "",
    shortBio: "",
    description: "",
    profileImageUrl: "",
    email: "",
    location: "",
    resumeUrl: "",
  });

  // === Fetch About Data ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAbout();
        if (res.success && res.data) setFormData(res.data);
      } catch {
        toast.error("Failed to load About data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // === Handle Input Changes ===
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // === Upload Image or Resume ===
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    const data = new FormData();
    data.append("file", file);
    data.append(
      "upload_preset",
      process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const xhr = new XMLHttpRequest();
      const uploadType = "auto"; // Automatically detect file type

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/${uploadType}/upload`
      );

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          setUploadProgress(Math.round((event.loaded * 100) / event.total));
        }
      });

      xhr.onload = () => {
        const json = JSON.parse(xhr.responseText);

        if (json.secure_url) {
          setFormData((prev) => ({
            ...prev,
            ...(type === "image"
              ? { profileImageUrl: json.secure_url }
              : { resumeUrl: json.secure_url }),
          }));

          toast.success(
            type === "image"
              ? "✅ Profile image uploaded!"
              : "📄 Resume uploaded successfully!"
          );
        } else {
          toast.error("Upload failed. Try again.");
        }

        setUploading(false);
        setUploadProgress(0);
      };

      xhr.onerror = () => {
        toast.error("Error uploading file.");
        setUploading(false);
        setUploadProgress(0);
      };

      xhr.send(data);
    } catch (err) {
      console.error(err);
      toast.error("Error uploading file.");
      setUploading(false);
    }
  };

  // === Save Data ===
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateAbout(formData);
      if (res.success) toast.success("About section updated successfully!");
      else toast.error(res.message || "Update failed.");
    } catch {
      toast.error("Error saving data.");
    } finally {
      setSaving(false);
    }
  };

  // === Input Theme ===
  const inputTheme = {
    blackgold: "bg-gray-900 text-gray-100 border-gray-700 focus:border-yellow-400",
    forest: "bg-green-900 text-green-100 border-green-700 focus:border-emerald-400",
    cyberpunk: "bg-gray-900 text-pink-300 border-pink-700 focus:border-cyan-400",
    lightblue: "bg-white text-gray-800 border-blue-300 focus:border-blue-600",
    lavender: "bg-white text-gray-800 border-purple-300 focus:border-purple-600",
  }[themeName];

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${theme.bg} ${theme.text}`}
      >
        <Loader2 className="animate-spin mr-2" /> Loading About Data...
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col lg:flex-row min-h-screen ${theme.bg} ${theme.text}`}
    >
      <Toaster position="top-center" />

      {/* LEFT — Editor */}
      <div className={`lg:w-1/2 w-full p-8 border-r ${theme.border}`}>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <User /> Edit About Section
        </h2>

        <div className="space-y-4">
          {[
            { label: "Full Name", name: "fullName" },
            { label: "Role / Title", name: "role" },
            { label: "Short Bio", name: "shortBio" },
            { label: "Detailed Description", name: "description" },
            { label: "Email", name: "email" },
            { label: "Location", name: "location" },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-sm opacity-80 mb-1">{f.label}</label>
              {f.name === "description" ? (
                <textarea
                  name={f.name}
                  value={formData[f.name]}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-md outline-none h-32 resize-none ${inputTheme}`}
                />
              ) : (
                <input
                  type="text"
                  name={f.name}
                  value={formData[f.name]}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-md outline-none ${inputTheme}`}
                />
              )}
            </div>
          ))}

          {uploading && (
            <div className="mt-3 w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 bg-yellow-400 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          {/* Upload Buttons */}
          <div className="flex items-center justify-between mt-4">
            <label className="font-medium">Profile Image:</label>
            <label
              className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md ${theme.btn}`}
            >
              <UploadCloud size={18} /> Upload
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "image")}
                hidden
              />
            </label>
          </div>

          <div className="flex items-center justify-between mt-2">
            <label className="font-medium">Resume (PDF):</label>
            <label
              className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md ${theme.btn}`}
            >
              <FileUp size={18} /> Upload
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileUpload(e, "resume")}
                hidden
              />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving || uploading}
          className={`mt-6 flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 ${theme.btn}`}
        >
          {saving || uploading ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Please Wait...
            </>
          ) : (
            <>
              <Save size={18} /> Save Changes
            </>
          )}
        </button>
      </div>

    
{/* RIGHT — Live Preview */}

<div
  className={`lg:w-1/2 w-full flex justify-center items-center p-10 border-l ${theme.border} ${theme.bg} ${theme.text}`}
>
  <div className="w-full max-w-2xl text-center space-y-8 bg-opacity-10 p-8 rounded-3xl shadow-2xl backdrop-blur-md transition-all duration-300 transform hover:scale-[1.01]">
    
    {/* Circular Profile Image */}
    {formData.profileImageUrl ? (
      <div className="relative flex justify-center">
        <img
          src={formData.profileImageUrl}
          alt="Profile"
          className="w-44 h-44 md:w-52 md:h-52 object-cover rounded-full shadow-xl border-4 border-opacity-80 transition-transform duration-700 hover:scale-105"
          style={{
            borderColor:
              themeName === "blackgold"
                ? "#facc15"
                : themeName === "forest"
                ? "#34d399"
                : themeName === "cyberpunk"
                ? "#22d3ee"
                : themeName === "lightblue"
                ? "#2563eb"
                : "#a855f7",
          }}
        />
      </div>
    ) : (
      <div className="w-44 h-44 md:w-52 md:h-52 bg-gray-700 rounded-full flex items-center justify-center text-sm">
        No Image
      </div>
    )}

    {/* Info */}
    <div className="space-y-2">
      <h1 className={`text-3xl md:text-4xl font-extrabold tracking-wide ${theme.accent}`}>
        {formData.fullName || "Your Name"}
      </h1>
      <p className="text-lg italic font-medium opacity-80">
        {formData.role || "Your Role / Title"}
      </p>
    </div>

    {/* Bio Section */}
    <div className="space-y-4 text-left leading-relaxed text-base md:text-lg opacity-90 px-3 md:px-6">
      {formData.shortBio && (
        <p
          className="font-semibold text-lg opacity-95 border-l-4 pl-3 rounded-md border-opacity-60"
          style={{
            borderColor:
              themeName === "blackgold"
                ? "#facc15"
                : themeName === "forest"
                ? "#34d399"
                : themeName === "cyberpunk"
                ? "#22d3ee"
                : themeName === "lightblue"
                ? "#2563eb"
                : "#a855f7",
          }}
        >
          {formData.shortBio}
        </p>
      )}
      {formData.description && (
        <p className="opacity-80 text-justify tracking-wide leading-relaxed">
          {formData.description}
        </p>
      )}
    </div>

    {/* Contact Info */}
    <div className="mt-6 flex flex-col gap-3 justify-center items-center text-sm md:text-base opacity-90">
      {/* Option A — Clickable Email */}
      <a
        href={`mailto:${formData.email}`}
        className="flex items-center gap-2 hover:underline hover:opacity-100 transition-all"
      >
        <Mail size={18} />
        {formData.email || "youremail@example.com"}
      </a>

      {/* Option B — Plain Text Email (uncomment if preferred) */}
      {/* <p className="flex items-center gap-2">
        <Mail size={18} /> {formData.email || "youremail@example.com"}
      </p> */}

      {formData.location && (
        <p className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c4.418 0 8-3.582 8-8a8 8 0 10-16 0c0 4.418 3.582 8 8 8z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v.01" />
          </svg>
          {formData.location}
        </p>
      )}
    </div>

    {/* Resume Buttons */}
    {formData.resumeUrl && (
      <div className="flex flex-wrap gap-5 mt-8 justify-center">
        <a
          href={formData.resumeUrl}
          target="_blank"
          rel="noreferrer"
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-sm md:text-base shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105 ${theme.btn}`}
        >
          <Eye size={18} /> View Resume
        </a>
        <a
          href={formData.resumeUrl}
          download
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-sm md:text-base shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105 ${theme.btn}`}
        >
          <Download size={18} /> Download
        </a>
      </div>
    )}
  </div>
</div>



    </div>
  );
};

export default AdminAbout;
