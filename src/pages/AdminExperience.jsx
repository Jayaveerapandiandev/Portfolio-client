import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Briefcase, Plus } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import {
  getCompanies,
  deleteExperienceCompany,
  deleteExperiencePosition
} from "../api/UserApi";
import CompanyCard from "./CompanyCard";
import ExperienceForm from "./ExperienceForm";

const AdminExperience = () => {
  const { theme } = useTheme();
  const [companies, setCompanies] = useState([]);
  const [showFormForCompany, setShowFormForCompany] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch companies with experiences
  const loadCompanies = async () => {
    setLoading(true);
    try {
      const res = await getCompanies();
      if (res?.success) {
        setCompanies(res.dataList || []);
      } else toast.error(res?.message || "Failed to load companies");
    } catch {
      toast.error("Error fetching companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  // 🔹 Delete Company
  const handleDeleteCompany = async (companyId) => {
    try {
      const res = await deleteExperienceCompany(companyId);
      if (res?.success) {
        toast.success("Company deleted successfully");
        setCompanies((prev) => prev.filter((c) => c.id !== companyId));
      } else {
        toast.error(res?.message || "Failed to delete company");
      }
    } catch {
      toast.error("Error deleting company");
    }
  };

  const handleDeletePosition = async (experienceId) => {
  try {
    const res = await deleteExperiencePosition(experienceId);
    if (res?.success) {
      toast.success("Position deleted successfully");
      loadCompanies(); // refresh UI
    } else {
      toast.error(res?.message || "Failed to delete position");
    }
  } catch (err) {
    toast.error("Error deleting position");
  }
};


  return (
    <section
      className={`min-h-screen p-8 transition-colors ${theme.bg} ${theme.text}`}
    >
      <Toaster position="top-center" />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Briefcase className="w-7 h-7" />
          Admin Experience
        </h1>

        <button
          onClick={() => setShowFormForCompany("new")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${theme.btn}`}
        >
          <Plus size={18} /> Add New Company
        </button>
      </div>

      {/* 🔹 Add New Company Form */}
      {showFormForCompany === "new" && (
        <div
          className={`mb-10 border ${theme.border} rounded-xl p-5 shadow-md ${theme.bg}`}
        >
          <ExperienceForm
            mode="newCompany"
            onSubmitSuccess={loadCompanies}
            onCancel={() => setShowFormForCompany(null)}
          />
        </div>
      )}

      {/* 🔹 Existing Companies */}
      {loading ? (
        <p>Loading companies...</p>
      ) : companies.length === 0 ? (
        <p>No companies found. Add your first one!</p>
      ) : (
        companies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            onAddPosition={() => setShowFormForCompany(company.id)}
            onDelete={() => handleDeleteCompany(company.id)}
            onDeletePosition={handleDeletePosition} 
          >
            {showFormForCompany === company.id && (
              <ExperienceForm
                mode="existingCompany"
                companyId={company.id}
                onSubmitSuccess={loadCompanies} // ✅ only this, no onSubmit
                onCancel={() => setShowFormForCompany(null)}
              />
            )}
          </CompanyCard>
        ))
      )}
    </section>
  );
};

export default AdminExperience;
