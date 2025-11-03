import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  UserPlus,
  UserMinus,
  Lock,
  BarChart3,
  FolderKanban,
  Wrench,
  Briefcase,
  Home,
  MessageCircle,
  Settings,
  ChevronRight,
  Menu,
  X,
  FileText,
  Info,
  BookOpenText,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { logoutUser, deleteUser } from "../api/UserApi";
import { useTheme } from "../context/ThemeContext";

const AdminDashboard = () => {
  const { theme, themeName } = useTheme();
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  const menuRef = useRef(null);
  const hoverTimeout = useRef(null);

  // === Handle outside click for dropdown ===
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // === Logout ===
  const handleLogout = async () => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      navigate("/admin/login");
      return;
    }

    try {
      const response = await logoutUser(sessionId);
      if (response.success) {
        localStorage.clear();
        toast.success("Logout successful!", {
          style: { background: "#111", color: "#facc15" },
        });
        setTimeout(() => navigate("/"), 1200);
      } else toast.error(response.message || "Logout failed.");
    } catch {
      toast.error("Error during logout. Please try again.");
    }
  };

  // === Delete User ===
  const handleDeleteUser = () => setShowDeleteModal(true);

  const confirmDeleteUser = async () => {
    if (!userIdToDelete.trim()) {
      toast.error("Please enter a User ID.");
      return;
    }
    try {
      const response = await deleteUser(userIdToDelete.trim());
      if (response.success) toast.success(`✅ User "${userIdToDelete}" deleted.`);
      else toast.error(response.message || "User deletion failed.");
    } catch {
      toast.error("⚠️ Failed to delete user.");
    } finally {
      setShowDeleteModal(false);
      setUserIdToDelete("");
    }
  };

  // === Navigation ===
  const handleCreateUser = () => navigate("/admin/create-user");
  const handleChangePassword = () => navigate("/admin/change-password");
  const goToSection = (path) => navigate(`/admin/${path}`);

  // === Dynamic Hover Classes ===
  const hoverStyles = {
    blackgold: "hover:bg-yellow-400/20 hover:text-yellow-400",
    lightblue: "hover:bg-blue-200/50 hover:text-blue-700",
    forest: "hover:bg-emerald-400/20 hover:text-emerald-400",
    lavender: "hover:bg-purple-200/50 hover:text-purple-700",
    cyberpunk: "hover:bg-cyan-400/20 hover:text-cyan-400",
  };
  const hoverClass = hoverStyles[themeName] || "hover:opacity-80";

  // === Sidebar background / text based on theme ===
  const sidebarTheme = {
    blackgold: "bg-gray-900 text-gray-200 border-gray-800",
    forest: "bg-green-950 text-green-100 border-green-800",
    cyberpunk: "bg-gray-950 text-pink-300 border-gray-800",
    lightblue: "bg-blue-100 text-gray-800 border-blue-300",
    lavender: "bg-purple-100 text-gray-800 border-purple-300",
  }[themeName];

  // === Header background based on theme ===
  const headerTheme = {
    blackgold: "bg-gray-900 border-gray-800",
    forest: "bg-green-950 border-green-800",
    cyberpunk: "bg-gray-950 border-gray-800",
    lightblue: "bg-blue-100 border-blue-300",
    lavender: "bg-purple-100 border-purple-300",
  }[themeName];

  const navItems = [
    { label: "Home", icon: Home, path: "AdminHome" },
    { label: "Visitor Analytics", icon: BarChart3, path: "analytics" },
    { label: "User Management", icon: User, path: "users" },
    { label: "Projects", icon: FolderKanban, path: "projects" },
    { label: "Skills", icon: Wrench, path: "skills" },
    { label: "Experience / Resume", icon: Briefcase, path: "experience" },
    { label: "About / Bio", icon: Info, path: "about" },
    { label: "Blog", icon: BookOpenText, path: "blog" },
    { label: "Messages", icon: MessageCircle, path: "messages" },
  ];

  const cards = [
    {
      icon: BarChart3,
      title: "Visitor Statistics",
      desc: ["Total visits", "Unique visitors", "Traffic sources", "Devices"],
      onClick: () => goToSection("analytics"),
    },
    {
      icon: FileText,
      title: "Engagement Metrics",
      desc: ["Avg. time on site", "Bounce rate", "Top projects"],
    },
    {
      icon: MessageCircle,
      title: "Contact Messages",
      desc: ["View replies", "Mark as read", "Export CSV"],
      onClick: () => goToSection("messages"),
    },
  ];

  return (
    <div className={`flex min-h-screen ${theme.bg} ${theme.text}`}>
      <Toaster position="top-center" />

      {/* ==== SIDEBAR ==== */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } ${sidebarTheme} transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className={`text-lg font-semibold ${theme.accent} ${!sidebarOpen && "hidden"}`}>
            Admin Panel
          </h2>
          <button onClick={() => setSidebarOpen((s) => !s)} className={`transition ${hoverClass}`}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          {navItems.map(({ label, icon: Icon, path }) => (
            <button
              key={label}
              onClick={() => goToSection(path)}
              className={`flex items-center w-full gap-3 px-4 py-2 rounded-md transition-colors duration-150 ${hoverClass}`}
            >
              <Icon size={20} className={`${theme.accent}`} />
              {sidebarOpen && <span>{label}</span>}
              <ChevronRight size={16} className={`${!sidebarOpen && "hidden"} ${theme.accent}`} />
            </button>
          ))}
        </nav>
      </aside>

      {/* ==== MAIN ==== */}
      <div className="flex-1 flex flex-col relative z-0">
        {/* ==== HEADER ==== */}
        <header className={`${headerTheme} px-6 py-3 flex items-center justify-between shadow-md relative z-40`}>
          <div className="flex items-center gap-3">
            <Settings className={`${theme.accent}`} size={24} />
            <h1 className={`text-lg font-semibold ${theme.accent}`}>Dashboard Overview</h1>
          </div>

          {/* ==== USER MENU ==== */}
          <div className="flex items-center gap-4 relative z-50" ref={menuRef}>
            <span className="text-sm hidden sm:block">
              Welcome, <span className={`${theme.accent}`}>{username || "Admin"}</span>
            </span>

            <button
              onClick={() => setUserMenuOpen((s) => !s)}
              onMouseEnter={() => {
                clearTimeout(hoverTimeout.current);
                setUserMenuOpen(true);
              }}
              onMouseLeave={() => {
                hoverTimeout.current = setTimeout(() => setUserMenuOpen(false), 200);
              }}
              className={`flex items-center gap-2 ${theme.btn} px-3 py-1.5 rounded-md transition`}
            >
              <User size={18} />
            </button>

            {/* Dropdown */}
            <div
              onMouseEnter={() => {
                clearTimeout(hoverTimeout.current);
                setUserMenuOpen(true);
              }}
              onMouseLeave={() => {
                hoverTimeout.current = setTimeout(() => setUserMenuOpen(false), 200);
              }}
              className={`absolute right-0 top-12 w-48 ${headerTheme} border ${theme.border} rounded-lg shadow-xl z-[999] transition-all duration-200 ${
                userMenuOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <button onClick={handleChangePassword} className={`w-full text-left px-4 py-2 ${hoverClass}`}>
                <Lock size={16} /> Change Password
              </button>
              <button onClick={handleCreateUser} className={`w-full text-left px-4 py-2 ${hoverClass}`}>
                <UserPlus size={16} /> Create User
              </button>
              <button
                onClick={handleDeleteUser}
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-600 hover:text-white"
              >
                <UserMinus size={16} /> Delete User
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-600 hover:text-white"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </header>

        {/* ==== BODY ==== */}
        <main className={`flex-1 p-8 ${theme.bg} overflow-y-auto`}>
          <h2 className={`text-xl font-semibold ${theme.accent} mb-6`}>Admin Insights</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-0">
            {cards.map(({ icon: Icon, title, desc, onClick }) => (
              <div
                key={title}
                onClick={() => onClick && onClick()}
                className={`rounded-2xl p-6 border ${theme.border} shadow-md transition-transform hover:scale-[1.01] cursor-pointer ${
                  themeName === "lightblue" || themeName === "lavender"
                    ? "bg-white text-gray-800"
                    : "bg-gray-900 text-gray-100"
                }`}
              >
                <Icon className={`${theme.accent} mb-3`} size={36} />
                <h3 className={`text-lg font-semibold ${theme.accent} ${hoverClass}`}>{title}</h3>
                <ul className="text-sm mt-2 space-y-1 opacity-80">
                  {desc.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* ==== DELETE USER MODAL ==== */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]">
          <div
            className={`p-6 rounded-xl shadow-lg w-80 border ${theme.border} ${
              themeName === "lightblue" || themeName === "lavender"
                ? "bg-white text-gray-800"
                : "bg-gray-900 text-gray-100"
            }`}
          >
            <h3 className={`text-lg font-semibold ${theme.accent} mb-4`}>Delete User</h3>
            <input
              type="text"
              placeholder="Enter User ID"
              value={userIdToDelete}
              onChange={(e) => setUserIdToDelete(e.target.value)}
              className={`w-full px-3 py-2 rounded-md border outline-none ${
                themeName === "lightblue" || themeName === "lavender"
                  ? "bg-gray-100 text-gray-800 border-gray-300 focus:border-blue-600"
                  : "bg-gray-800 text-gray-100 border-gray-700 focus:border-yellow-400"
              }`}
            />
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-md bg-gray-500 hover:bg-gray-600 text-white"
              >
                Cancel
              </button>
              <button onClick={confirmDeleteUser} className={`${theme.btn} px-4 py-2 rounded-md`}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
