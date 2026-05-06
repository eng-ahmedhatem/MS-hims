import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { 
  DocumentTextIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ChartBarIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [institution, setInstitution] = useState('');

  useEffect(() => {
    axios.get('/api/dashboard/stats').then(res => setStats(res.data));
    axios.get('/api/settings').then(res => setInstitution(res.data.institutionName));
  }, []);

  if (!stats) return <div className="text-center mt-10 font-cairo text-gray-600">جاري التحميل...</div>;

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-cairo">
      {/* العنوان الترحيبي */}
      <div className="mb-8 text-right">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 inline-block border-r-4 border-indigo-500 pr-3 animate-fade-in">
          مرحباً بك في {institution || 'النظام'}
        </h2>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[
          { label: 'إجمالي الطلبات', value: stats.total, icon: DocumentTextIcon, color: 'indigo' },
          { label: 'مكتملة', value: stats.completed, icon: CheckCircleIcon, color: 'emerald' },
          { label: 'قيد التنفيذ', value: stats.inProgress, icon: ClockIcon, color: 'amber' },
          { label: 'نسبة الإنجاز', value: `${stats.completionRate}%`, icon: ChartBarIcon, color: 'blue' }
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 group animate-slide-up"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex justify-between items-start">
              <item.icon className={`w-6 h-6 text-${item.color}-500 group-hover:scale-110 transition-transform duration-200`} />
            </div>
            <p className="text-gray-500 text-sm mt-3">{item.label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1 group-hover:text-indigo-600 transition-colors">
              {item.value}
            </p>
            <div className="w-0 h-0.5 bg-indigo-200 rounded-full mt-2 group-hover:w-full transition-all duration-500"></div>
          </div>
        ))}
      </div>

      {/* قسم أحدث الطلبات */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-2">
          <h3 className="text-lg font-bold text-gray-700">أحدث الطلبات</h3>
          <span className="text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">محدث</span>
        </div>

        {/* عرض كبطاقات للهواتف */}
        <div className="block md:hidden divide-y divide-gray-100">
          {stats.recent.map((ticket, idx) => (
            <div key={ticket._id} className="p-4 hover:bg-indigo-50/30 transition-all duration-200 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs text-gray-500">{ticket.ticketNumber}</span>
                <StatusBadge status={ticket.status} />
              </div>
              <p className="font-medium text-gray-800 mt-2">{ticket.title}</p>
              <div className="flex justify-between items-center mt-3 text-sm">
                <span className="text-gray-400">{new Date(ticket.createdAt).toLocaleDateString('ar-SA')}</span>
                <Link to={`/dashboard/tickets/${ticket._id}`} className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors inline-flex items-center gap-1">
                  عرض التفاصيل
                  <ArrowLeftIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* عرض كجدول للشاشات المتوسطة والكبيرة */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 text-right font-semibold">رقم التذكرة</th>
                <th className="px-5 py-3 text-right font-semibold">المشكلة</th>
                <th className="px-5 py-3 text-right font-semibold">الحالة</th>
                <th className="px-5 py-3 text-right font-semibold">تاريخ الطلب</th>
                <th className="px-5 py-3 text-right font-semibold">#</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.recent.map((ticket, idx) => (
                <tr key={ticket._id} className="hover:bg-indigo-50/20 transition-colors duration-150 group animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                  <td className="px-5 py-3 font-mono text-xs text-gray-600">{ticket.ticketNumber}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">{ticket.title}</td>
                  <td className="px-5 py-3">
                    <div className="transition-transform group-hover:scale-105">
                      <StatusBadge status={ticket.status} />
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{new Date(ticket.createdAt).toLocaleDateString('ar-SA')}</td>
                  <td className="px-5 py-3">
                    <Link to={`/dashboard/tickets/${ticket._id}`} className="text-indigo-600 hover:text-indigo-800 font-medium transition-all hover:mr-1 inline-flex items-center gap-1">
                      عرض
                      <ArrowLeftIcon className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {stats.recent.length === 0 && (
          <div className="text-center py-8 text-gray-400">لا توجد طلبات حديثة</div>
        )}
      </div>
    </div>
  );
}