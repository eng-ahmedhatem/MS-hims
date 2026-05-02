import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiClipboard, FiUsers, FiSettings, FiBarChart2, FiLogOut, FiPlusCircle } from 'react-icons/fi';
import axios from '../api/axios';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [institution, setInstitution] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      axios.get('/api/settings').then(res => setInstitution(res.data.institutionName));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-primary text-white flex flex-col shadow-lg">
      <div className="p-4 text-center border-b border-blue-800">
        <h1 className="text-lg font-bold">لوحة التحكم</h1>
        {institution && <p className="text-sm text-blue-200 mt-1">{institution}</p>}
        <p className="text-sm mt-1">{user?.fullName}</p>
        <p className="text-xs text-blue-300">{user?.role === 'admin' ? 'مدير النظام' : (user?.role === 'manager' ? 'مدير' : 'فني')}</p>
      </div>
      <nav className="flex-1 mt-4">
        <NavLink to="/" className="sidebar-link"><FiHome className="ml-2" /> الرئيسية</NavLink>
        <NavLink to="/tickets" className="sidebar-link"><FiClipboard className="ml-2" /> طلبات الصيانة</NavLink>
        <NavLink to="/tickets/new" className="sidebar-link"><FiPlusCircle className="ml-2" /> طلب صيانة جديد</NavLink>
        {user?.role === 'admin' && (
          <>
            <NavLink to="/managers" className="sidebar-link"><FiUsers className="ml-2" /> المديرين</NavLink>
            <NavLink to="/technicians" className="sidebar-link"><FiUsers className="ml-2" /> الفنيين</NavLink>
            <NavLink to="/reports" className="sidebar-link"><FiBarChart2 className="ml-2" /> التقارير</NavLink>
            <NavLink to="/settings" className="sidebar-link"><FiSettings className="ml-2" /> الإعدادات</NavLink>
          </>
        )}
      </nav>
      <button onClick={handleLogout} className="m-4 flex items-center text-red-200 hover:text-white">
        <FiLogOut className="ml-2" /> تسجيل الخروج
      </button>
    </aside>
  );
}