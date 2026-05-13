import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FiUser, FiLock, FiEye, FiEyeOff, FiLogIn, FiArrowRight
} from "react-icons/fi";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(username, password);
      // توجيه بناءً على الدور
      if (data.role === "technician") {
        navigate("/dashboard/tickets");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "خطأ في تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-cairo relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 flex items-center justify-center p-4">
      {/* موجات خلفية زجاجية */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg className="relative block w-full h-32 md:h-48 text-indigo-100/60" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,100 C360,200 720,0 1080,100 C1260,160 1380,120 1440,100 L1440,0 L0,0 Z" fill="currentColor" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180 z-0">
        <svg className="relative block w-full h-32 md:h-48 text-indigo-100/60" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,100 C360,200 720,0 1080,100 C1260,160 1380,120 1440,100 L1440,0 L0,0 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* زر الرجوع */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-white/60 transition-colors text-sm"
        >
          <FiArrowRight className="w-4 h-4" />
          رجوع
        </button>

        {/* البطاقة الرئيسية */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-6 md:p-8 animate-fadeInUp">
          {/* الشعار والعنوان */}
          <div className="text-center mb-8">
            <img
              src="https://lmsg1.himsb.edu.eg/pluginfile.php/1/theme_academi/logo/1762726301/HIMS.png"
              alt="شعار النظام"
              className="w-16 h-16 object-contain mx-auto mb-4 rounded-full bg-white/60 p-2 shadow-md"
            />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              تسجيل الدخول
            </h2>
            <p className="text-gray-500 text-sm mt-1">نظام إدارة الصيانة</p>
          </div>

          {/* رسالة الخطأ */}
          {error && (
            <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl text-red-600 text-sm flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* اسم المستخدم */}
            <div>
              <label className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-2">
                <FiUser className="w-4 h-4 text-indigo-500" />
                اسم المستخدم
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-3.5 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md transition-all"
                placeholder="أدخل اسم المستخدم"
              />
            </div>

            {/* كلمة المرور */}
            <div>
              <label className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-2">
                <FiLock className="w-4 h-4 text-indigo-500" />
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3.5 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* زر تسجيل الدخول */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-lg disabled:opacity-50"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              ) : (
                <FiLogIn className="w-5 h-5" />
              )}
              <span>{loading ? "جارٍ المصادقة..." : "تسجيل الدخول"}</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200/50 text-center">
            <p className="text-gray-500 text-sm">
              تواجه مشكلة؟{" "}
              <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                تواصل مع الدعم الفني
              </a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out both;
        }
      `}</style>
    </div>
  );
}