import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';
import {
  FiLayers, FiCheckCircle, FiClock, FiActivity,
  FiArrowLeft, FiPieChart, FiBarChart2, FiTrendingUp,
  FiList, FiEye, FiAlertCircle
} from 'react-icons/fi';

const COLORS = ['#4f46e5', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

function StatCard({ label, value, icon, color, delay = 0 }) {
  const gradients = {
    indigo: 'from-indigo-500 to-indigo-600',
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-400 to-amber-500',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <div
      className="bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-white/60 shadow-lg hover:shadow-xl transition-all animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradients[color]} text-white`}>
          {icon}
        </div>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [institution, setInstitution] = useState('');

  useEffect(() => {
    axios.get('/api/dashboard/stats').then(res => setStats(res.data));
    axios.get('/api/settings').then(res => setInstitution(res.data.institutionName));
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen font-cairo bg-gradient-to-br from-gray-50 to-indigo-50/30 flex items-center justify-center">
        <p className="text-xl text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  const pieData = [
    { name: 'مكتمل', value: stats.completed },
    { name: 'قيد التنفيذ', value: stats.inProgress },
    { name: 'جديد', value: stats.total - stats.completed - stats.inProgress },
  ];

  // ✅ بدلاً من أخذ أول 3 طلبات، نفلتر الطلبات العاجلة ونأخذ أول 4
  const urgentTickets = stats.recent?.filter(ticket => ticket.priority === 'عاجل').slice(0, 4) || [];

  return (
    <div className="min-h-screen font-cairo relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 p-4 md:p-6">
      {/* موجات خلفية زجاجية */}

      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180 z-0">
        <svg className="relative block w-full h-32 md:h-48 text-indigo-100/60" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,100 C360,200 720,0 1080,100 C1260,160 1380,120 1440,100 L1440,0 L0,0 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="relative z-10 space-y-8">
        {/* العنوان الترحيبي */}
        <div className="mb-4">
          <h1 className="text-3xl mb-6 md:text-4xl font-bold text-gray-800 flex items-center gap-2">
            <span className="h-10 w-2 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded-full"></span>
            مرحباً بك في {institution || 'النظام'}
          </h1>
          <p className="text-gray-500 text-base mt-2 mr-3">
            نظرة عامة على حالة الصيانة وأحدث الطلبات
          </p>
        </div>

        {/* الصف الأول: بطاقات الإحصائيات الرئيسية */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="إجمالي الطلبات" value={stats.total} icon={<FiLayers className="w-6 h-6" />} color="indigo" delay={0} />
          <StatCard label="مكتملة" value={stats.completed} icon={<FiCheckCircle className="w-6 h-6" />} color="emerald" delay={100} />
          <StatCard label="قيد التنفيذ" value={stats.inProgress} icon={<FiClock className="w-6 h-6" />} color="amber" delay={200} />
          <StatCard label="نسبة الإنجاز" value={`${stats.completionRate}%`} icon={<FiTrendingUp className="w-6 h-6" />} color="purple" delay={300} />
        </div>

        {/* الصف الثاني: رسم بياني + الطلبات العاجلة */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* بطاقة الرسم البياني (Pie Chart) */}
          <div className="lg:col-span-1 bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-indigo-100 rounded-xl">
                <FiPieChart className="text-indigo-600 w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">توزيع الحالات</h3>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" label={null}>
                    {pieData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} stroke="white" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4 text-sm text-gray-600">
              {pieData.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></span>
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 🚨 الطلبات العاجلة */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-red-100 rounded-xl">
                <FiAlertCircle className="text-red-600 w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">الطلبات العاجلة</h3>
            </div>
            <div className="grid sm:grid-cols-1 xl:grid-cols-2 gap-4">
              {urgentTickets.length > 0 ? (
                urgentTickets.map((ticket, idx) => (
                  <div
                    key={ticket._id}
                    className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg p-5 hover:shadow-xl transition-all animate-fadeInUp"
                    style={{ animationDelay: `${idx * 80}ms` }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-xs text-gray-500 bg-gray-100/80 px-2 py-1 rounded-full">
                        {ticket.ticketNumber}
                      </span>
                      <StatusBadge status={ticket.status} />
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg mb-3 line-clamp-1">{ticket.title}</h4>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">
                        {new Date(ticket.createdAt).toLocaleDateString('ar-SA')}
                      </span>
                      <Link
                        to={`/dashboard/tickets/${ticket._id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        عرض
                        <FiEye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 col-span-full text-center py-6">لا توجد طلبات عاجلة</div>
              )}
            </div>
          </div>
        </div>

        {/* قسم جميع الطلبات الحديثة */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <FiList className="text-indigo-600 w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">أحدث الطلبات</h3>
            <span className="text-sm text-gray-400 bg-white/60 px-3 py-0.5 rounded-full mr-auto">آخر {stats.recent.length} طلبات</span>
          </div>

          {/* عرض الهواتف */}
          <div className="block md:hidden space-y-4">
            {stats.recent.map((ticket, idx) => (
              <div key={ticket._id} className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/60 animate-fadeInUp" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-sm text-gray-500">{ticket.ticketNumber}</span>
                  <StatusBadge status={ticket.status} />
                </div>
                <h4 className="font-bold text-gray-800 text-lg mb-2">{ticket.title}</h4>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">{new Date(ticket.createdAt).toLocaleDateString('ar-SA')}</span>
                  <Link to={`/dashboard/tickets/${ticket._id}`} className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1">
                    عرض التفاصيل
                    <FiArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
            {stats.recent.length === 0 && <div className="text-center py-6 text-gray-400">لا توجد طلبات حديثة</div>}
          </div>

          {/* عرض الشاشات الكبيرة */}
          <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {stats.recent.map((ticket, idx) => (
              <div key={ticket._id} className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/60 shadow-md hover:shadow-md transition-all animate-fadeInUp flex flex-col" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-sm text-gray-500 bg-gray-100/80 px-2 py-0.5 rounded-full">{ticket.ticketNumber}</span>
                  <StatusBadge status={ticket.status} />
                </div>
                <h4 className="font-bold text-gray-800 text-base mb-3 line-clamp-2 flex-1">{ticket.title}</h4>
                <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-100 text-sm">
                  <span className="text-gray-400">{new Date(ticket.createdAt).toLocaleDateString('ar-SA')}</span>
                  <Link to={`/dashboard/tickets/${ticket._id}`} className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1">
                    عرض
                    <FiEye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
            {stats.recent.length === 0 && <div className="text-gray-400 col-span-full text-center py-6">لا توجد طلبات حديثة</div>}
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