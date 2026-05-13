import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiHome, FiList, FiPlusCircle, FiUsers, FiBarChart2,
  FiSettings, FiLogOut, FiMenu, FiX
} from "react-icons/fi";
import axios from "../api/axios";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [institution, setInstitution] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    axios
      .get("/api/settings")
      .then((res) => setInstitution(res.data.institutionName || ""))
      .catch(() => setInstitution(""));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getUserInitials = () => {
    if (!user?.fullName) return "?";
    const names = user.fullName.trim().split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* زر الهمبرغر للجوال */}
      <button
        className="fixed top-4 left-4 z-50 p-2.5 bg-white/70 backdrop-blur-lg rounded-2xl border border-white/60 shadow-lg md:hidden text-gray-700 hover:text-indigo-600 transition-colors"
        onClick={() => setIsOpen(true)}
        aria-label="فتح القائمة"
      >
        <FiMenu className="w-6 h-6" />
      </button>

      {/* خلفية معتمة عند فتح الشريط في الجوال */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* الشريط الجانبي */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-white/80 backdrop-blur-xl border-l border-white/60 shadow-2xl flex flex-col font-cairo z-50 transition-transform duration-300 ease-in-out
        md:static md:translate-x-0 md:w-64 md:rounded-none md:shadow-none md:border-l-0 md:bg-white/70
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* رأس الشريط */}
        <div className="p-5 border-b border-gray-200/60">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">لوحة التحكم</h1>
            <button
              className="md:hidden p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              onClick={closeSidebar}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          {institution && (
            <p className="text-sm text-gray-500 mt-1 truncate">{institution}</p>
          )}

          {/* معلومات المستخدم */}
          <div className="mt-5 pt-4 border-t border-gray-200/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-md ring-2 ring-indigo-300/50">
                <span className="text-white text-sm font-bold">
                  {getUserInitials()}
                </span>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-800 truncate">
                  {user?.fullName || "مستخدم"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role === "admin"
                    ? "مدير النظام"
                    : user?.role === "manager"
                      ? "مدير"
                      : "فني"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* روابط التنقل */}
        <nav className="flex-1 mt-4 px-3 space-y-1 overflow-y-auto">
          {user.role !== "technician" && (
            <SidebarLink to="/dashboard" icon={<FiHome />} label="الرئيسية" onClick={closeSidebar} exact />
          )}
          <SidebarLink to="/dashboard/tickets" icon={<FiList />} label="طلبات الصيانة" onClick={closeSidebar} />
          <SidebarLink to="/dashboard/tickets/new" icon={<FiPlusCircle />} label="طلب جديد" onClick={closeSidebar} />

          {user?.role === "admin" && (
            <>
              <SidebarLink to="/dashboard/managers" icon={<FiUsers />} label="المديرين" onClick={closeSidebar} />
              <SidebarLink to="/dashboard/technicians" icon={<FiUsers />} label="الفنيين" onClick={closeSidebar} />
              <SidebarLink to="/dashboard/reports" icon={<FiBarChart2 />} label="التقارير" onClick={closeSidebar} />
              <SidebarLink to="/dashboard/settings" icon={<FiSettings />} label="الإعدادات" onClick={closeSidebar} />
            </>
          )}
        </nav>

        {/* تسجيل الخروج */}
        <button
          onClick={handleLogout}
          className="mx-4 mb-5 mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50/80 text-red-600 hover:bg-red-100 transition-all duration-200 font-medium text-sm border border-red-200/60"
        >
          <FiLogOut className="w-5 h-5" />
          تسجيل الخروج
        </button>
      </aside>
    </>
  );
}

// مكون مساعد لرابط القائمة
function SidebarLink({ to, icon, label, onClick, exact = false }) {
  return (
    <NavLink
      to={to}
      end={exact}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-medium ${
          isActive
            ? "bg-indigo-100/80 text-indigo-700 shadow-sm"
            : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
        }`
      }
    >
      <span className="w-5 h-5 flex-shrink-0">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}