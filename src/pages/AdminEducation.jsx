import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  getEducation,
  addEducation,
  updateEducation,
  deleteEducationById,
} from "../api/UserApi";
import { useTheme } from "../context/ThemeContext";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Loader2,
  Upload,
} from "lucide-react";

/* =========================
   INITIAL FORM STATE
========================= */
const emptyForm = {
  educationType: "",
  instituteName: "",
  department: "",
  percentage: "",
  startYear: "",
  endYear: "",
  location: "",
  description: "",
  highlights: "",
  instituteLogoUrl: "",
  instituteLogoPublicId: "",
  isVisible: true,
};

const AdminEducation = () => {
  const { theme, themeName } = useTheme();

  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  /* =========================
     FETCH
  ========================= */
  const fetchEducation = async () => {
    try {
      const res = await getEducation();
      if (res?.success) setEducations(res.data || []);
    } catch {
      toast.error("Failed to fetch education");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  /* =========================
     OPEN
  ========================= */
  const openAdd = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (edu) => {
    setFormData({
      ...edu,
      highlights: edu.highlights?.join(", "),
      instituteLogoUrl: edu.instituteLogo?.url || "",
      instituteLogoPublicId: edu.instituteLogo?.publicId || "",
    });
    setEditingId(edu.id);
    setShowForm(true);
  };

  /* =========================
     CLOUDINARY UPLOAD
  ========================= */
  const uploadLogo = async (file) => {
    setUploadingLogo(true);
    const data = new FormData();
    data.append("file", file);
    data.append(
      "upload_preset",
      process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      );
      const img = await res.json();

      setFormData((p) => ({
        ...p,
        instituteLogoUrl: img.secure_url,
        instituteLogoPublicId: img.public_id,
      }));

      toast.success("Logo uploaded");
    } catch {
      toast.error("Logo upload failed");
    } finally {
      setUploadingLogo(false);
    }
  };

  /* =========================
     SAVE
  ========================= */
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        highlights: formData.highlights
          .split(",")
          .map((h) => h.trim()),
        instituteLogo: formData.instituteLogoUrl
          ? {
              url: formData.instituteLogoUrl,
              publicId: formData.instituteLogoPublicId,
            }
          : null,
      };

      const res = editingId
        ? await updateEducation(editingId, payload)
        : await addEducation(payload);

      if (res?.success) {
        toast.success(editingId ? "Education updated" : "Education added");
        fetchEducation();
        setShowForm(false);
      }
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     DELETE
  ========================= */
  const handleDelete = (edu) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p>Delete this education?</p>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                await deleteEducationById(edu.id);
                setEducations((p) =>
                  p.filter((e) => e.id !== edu.id)
                );
                toast.success("Deleted");
              }}
              className="px-3 py-1 rounded bg-red-600 text-white"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 rounded bg-gray-500 text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 6000 }
    );
  };

  /* =========================
     INPUT
  ========================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className={`min-h-screen p-6 ${theme.bg} ${theme.text}`}>
      <Toaster position="top-center" />

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${theme.accent}`}>
          Admin Education
        </h1>
        <button
          onClick={openAdd}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme.btn}`}
        >
          <Plus size={16} /> Add Education
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <div className="space-y-4">
          {educations.map((edu) => (
            <div
              key={edu.id}
              className={`p-5 rounded-xl border ${theme.border}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  {edu.instituteLogo?.url && (
                    <img
                      src={edu.instituteLogo.url}
                      alt="logo"
                      className="w-14 h-14 rounded-md object-contain bg-white"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">
                      {edu.educationType}
                    </h3>
                    <p className="text-sm opacity-80">
                      {edu.instituteName}
                    </p>
                    <p className="text-xs opacity-60">
                      {edu.startYear} – {edu.endYear}
                    </p>
                  </div>
                </div>

                {/* VISIBILITY */}
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    edu.isVisible
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-500/20 text-gray-300"
                  }`}
                >
                  {edu.isVisible ? "Visible" : "Hidden"}
                </span>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-4 mt-4 text-sm">
                <button
                  onClick={() => openEdit(edu)}
                  className="text-blue-400 flex items-center gap-1"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(edu)}
                  className="text-red-400 flex items-center gap-1"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div
            className={`w-full max-w-2xl p-6 rounded-xl ${
              themeName === "lightblue" || themeName === "lavender"
                ? "bg-white text-gray-800"
                : "bg-gray-900 text-gray-100"
            }`}
          >
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editingId ? "Edit Education" : "Add Education"}
              </h2>
              <button onClick={() => setShowForm(false)}>
                <X />
              </button>
            </div>

            {/* FORM */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ["educationType", "Education Type"],
                ["instituteName", "Institute Name"],
                ["department", "Department"],
                ["percentage", "CGPA / Percentage"],
                ["startYear", "Start Year"],
                ["endYear", "End Year"],
                ["location", "Location"],
              ].map(([n, p]) => (
                <input
                  key={n}
                  name={n}
                  value={formData[n]}
                  onChange={handleChange}
                  placeholder={p}
                  className={`px-3 py-2 rounded ${theme.input}`}
                />
              ))}
            </div>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className={`mt-4 w-full h-24 px-3 py-2 rounded ${theme.input}`}
            />

            <input
              name="highlights"
              value={formData.highlights}
              onChange={handleChange}
              placeholder="Highlights (comma separated)"
              className={`mt-4 w-full px-3 py-2 rounded ${theme.input}`}
            />

            {/* VISIBILITY */}
            <label className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                name="isVisible"
                checked={formData.isVisible}
                onChange={handleChange}
              />
              <span>Visible on website</span>
            </label>

            {/* LOGO UPLOAD */}
            <div className="mt-4">
              <label className="text-sm opacity-80">Institute Logo</label>
              <div
                className={`mt-2 flex items-center gap-3 p-3 border rounded-lg ${theme.border}`}
              >
                <Upload size={18} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => uploadLogo(e.target.files[0])}
                />
                {uploadingLogo && (
                  <Loader2 className="animate-spin ml-auto" />
                )}
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className={`mt-6 w-full flex justify-center gap-2 px-4 py-2 rounded-lg ${theme.btn}`}
            >
              {saving ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEducation;
