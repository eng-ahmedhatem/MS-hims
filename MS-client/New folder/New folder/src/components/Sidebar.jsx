import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  PlusCircleIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import axios from '../api/axios';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [institution, setInstitution] = useState('');

  useEffect(() => {
    axios.get('/api/settings')
      .then(res => setInstitution(res.data.institutionName || ''))
      .catch(() => setInstitution(''));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // دالة لاستخراج الأحرف الأولى من اسم المستخدم
  const getUserInitials = () => {
    if (!user?.fullName) return '?';
    const names = user.fullName.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-indigo-800 to-indigo-900 text-white flex flex-col shadow-xl font-cairo">
      {/* الهيدر مع الأفاتار والمعلومات */}
      <div className="p-5 text-center border-b border-indigo-700/50">
        <h1 className="text-xl font-bold tracking-wide">لوحة التحكم</h1>
        {institution && (
          <p className="text-sm text-indigo-200 mt-1 truncate">{institution}</p>
        )}
        
        {/* قسم المستخدم مع أفاتار */}
        <div className="mt-4 pt-3 border-t border-indigo-700/30">
          <div className="flex flex-col items-center">
            {/* الأفاتار الدائري */}
            <div className="relative group">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg ring-2 ring-indigo-300/50 transition-all duration-300 group-hover:scale-105">
                <span className="text-white text-xl font-bold">{getUserInitials()}</span>
              </div>
              {/* أيقونة صغيرة كديكور (اختياري) */}
              <div className="absolute -bottom-1 -right-1 bg-indigo-700 rounded-full p-0.5 ring-2 ring-indigo-800">
                <UserCircleIcon className="w-4 h-4 text-indigo-200" />
              </div>
            </div>
            
            {/* اسم المستخدم والدور */}
            <div className="mt-3 text-center">
              <p className="text-sm font-bold text-white">{user?.fullName || 'مستخدم'}</p>
              <p className="text-xs text-indigo-200 mt-0.5">
                {user?.role === 'admin' ? 'مدير النظام' : user?.role === 'manager' ? 'مدير' : 'فني'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* قائمة الروابط (لم تتغير) */}
      <nav className="flex-1 mt-6 px-3 space-y-1">
        <NavLink 
          to="/dashboard" 
          end 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
              isActive 
                ? 'bg-indigo-700/50 text-white shadow-md' 
                : 'text-indigo-100 hover:bg-indigo-700/30 hover:text-white'
            }`
          }
        >
          <HomeIcon className="w-5 h-5" />
          <span>الرئيسية</span>
        </NavLink>

        <NavLink 
          to="/dashboard/tickets" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
              isActive 
                ? 'bg-indigo-700/50 text-white shadow-md' 
                : 'text-indigo-100 hover:bg-indigo-700/30 hover:text-white'
            }`
          }
        >
          <ClipboardDocumentListIcon className="w-5 h-5" />
          <span>طلبات الصيانة</span>
        </NavLink>

        <NavLink 
          to="/dashboard/tickets/new" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
              isActive 
                ? 'bg-indigo-700/50 text-white shadow-md' 
                : 'text-indigo-100 hover:bg-indigo-700/30 hover:text-white'
            }`
          }
        >
          <PlusCircleIcon className="w-5 h-5" />
          <span>طلب جديد</span>
        </NavLink>

        {user?.role === 'admin' && (
          <>
            <NavLink 
              to="/dashboard/managers" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-700/50 text-white shadow-md' 
                    : 'text-indigo-100 hover:bg-indigo-700/30 hover:text-white'
                }`
              }
            >
              <UserGroupIcon className="w-5 h-5" />
              <span>المديرين</span>
            </NavLink>

            <NavLink 
              to="/dashboard/technicians" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-700/50 text-white shadow-md' 
                    : 'text-indigo-100 hover:bg-indigo-700/30 hover:text-white'
                }`
              }
            >
              <UserGroupIcon className="w-5 h-5" />
              <span>الفنيين</span>
            </NavLink>

            <NavLink 
              to="/dashboard/reports" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-700/50 text-white shadow-md' 
                    : 'text-indigo-100 hover:bg-indigo-700/30 hover:text-white'
                }`
              }
            >
              <ChartBarIcon className="w-5 h-5" />
              <span>التقارير</span>
            </NavLink>

            <NavLink 
              to="/dashboard/settings" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-700/50 text-white shadow-md' 
                    : 'text-indigo-100 hover:bg-indigo-700/30 hover:text-white'
                }`
              }
            >
              <Cog6ToothIcon className="w-5 h-5" />
              <span>الإعدادات</span>
            </NavLink>
          </>
        )}
      </nav>

      <button 
        onClick={handleLogout} 
        className="mx-4 mb-5 mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/20 text-red-200 hover:bg-red-500/30 hover:text-white transition-all duration-200 font-medium"
      >
        <ArrowRightOnRectangleIcon className="w-5 h-5" />
        تسجيل الخروج
      </button>
    </aside>
  );
}