import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MdPerson, MdLock, MdLogin, MdEngineering, MdVisibility, MdVisibilityOff } from 'react-icons/md';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'خطأ في تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-almarai bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* صورة خلفية بانورامية بعتامة منخفضة */}
      <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAB8nHOI5aAAIJ-CxihQX0pHyULd6fUM_Bno2YYa0yZO_gQj60kJfRhByN9M_hOY4JiQLTk3vyX3PecOctmDCW_S4TMsVpjOVncHVSPUAs34IbBUXvkbFtkek_WgObHT9w77JA39XPuQbjLbFiWsLspe2QfxQQ8J2ebI0CHNlRVSHcDKV7zLtziUyn-67pHBk_gwcbdrU9Zt79BWeK_E2QcLVWohxgguYnauMXYxRnN_EyoxgCNKCLjF5aIew4bjTKNnBKbOyWqtzNt"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* دوائر زخرفية */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"></div>

      {/* شبكة نقاط دقيقة */}
      <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10 w-full flex items-center justify-center p-4 sm:p-6">
        {/* البطاقة الزجاجية المدورة */}
        <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl ring-1 ring-white/20 overflow-hidden">
          {/* ترويسة داخلية مع صورة صغيرة */}
          <div className="relative h-32 bg-gradient-to-r from-blue-600 to-blue-400 overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAB8nHOI5aAAIJ-CxihQX0pHyULd6fUM_Bno2YYa0yZO_gQj60kJfRhByN9M_hOY4JiQLTk3vyX3PecOctmDCW_S4TMsVpjOVncHVSPUAs34IbBUXvkbFtkek_WgObHT9w77JA39XPuQbjLbFiWsLspe2QfxQQ8J2ebI0CHNlRVSHcDKV7zLtziUyn-67pHBk_gwcbdrU9Zt79BWeK_E2QcLVWohxgguYnauMXYxRnN_EyoxgCNKCLjF5aIew4bjTKNnBKbOyWqtzNt"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full pt-2">
              <div className=" logo w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-1 ring-2 ring-white/40">
              </div>
              <h2 className="text-white font-bold text-xl drop-shadow">تسجيل الدخول لنظام الصيانة</h2>
            </div>
          </div>

          {/* محتوى النموذج */}
          <div className="p-8 pt-6">
            {/* خطأ */}
            {error && (
              <div className="mb-6 p-3 bg-red-100/90 backdrop-blur-sm border border-red-200 text-red-800 rounded-xl text-sm text-center animate-pulse">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* اسم المستخدم */}
              <div>
                <label className="block text-sm font-bold text-white/90 mb-2">اسم المستخدم</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-blue-200">
                    <MdPerson className="text-xl" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full pr-12 pl-4 py-3.5 bg-white/10 border border-white/20 rounded-xl focus:border-blue-300 focus:ring-2 focus:ring-blue-400/30 transition-all outline-none text-white placeholder:text-white/50"
                    placeholder="أدخل اسم المستخدم"
                  />
                </div>
              </div>

              {/* كلمة المرور */}
              <div>
                <label className="block text-sm font-bold text-white/90 mb-2">كلمة المرور</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-blue-200">
                    <MdLock className="text-xl" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pr-12 pl-12 py-3.5 bg-white/10 border border-white/20 rounded-xl focus:border-blue-300 focus:ring-2 focus:ring-blue-400/30 transition-all outline-none text-white placeholder:text-white/50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-0 pl-4 flex items-center text-blue-200 hover:text-white transition-colors"
                  >
                    {showPassword ? <MdVisibilityOff className="text-xl" /> : <MdVisibility className="text-xl" />}
                  </button>
                </div>
              </div>

              {/* تذكرني ونسيت كلمة المرور */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-white/80">
                  <input type="checkbox" className="rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-400" />
                  تذكرني
                </label>
              </div>

              {/* زر تسجيل الدخول – أزرق بالكامل */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 ${
                  loading ? 'opacity-80 cursor-wait' : ''
                }`}
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <MdLogin className="text-xl" />
                )}
                <span>{loading ? 'جارٍ المصادقة...' : 'تسجيل الدخول'}</span>
              </button>
            </form>

          
            {/* الدعم الفني */}
            <div className="mt-8 pt-4 border-t border-white/20 text-center">
              <p className="text-white/70 text-sm">
                تواجه مشكلة؟{' '}
                <a href="#" className="text-blue-200 hover:text-white font-bold transition-colors">تواصل مع الدعم الفني</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* توقيع المطور – يظهر دائماً */}
      <div className="absolute bottom-4 w-full text-center z-10">
        <p className="text-white/50 text-xs tracking-widest">تم التنفيذ بواسطة م / أحمد حاتم</p>
      </div>
    </div>
  );
}