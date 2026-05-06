import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { MdDelete } from 'react-icons/md';
import { FiClock, FiUser, FiCalendar } from 'react-icons/fi';

export default function TicketsList() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [filters, setFilters] = useState({ status: '', priority: '', department: '' });

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tickets, filters]);

  const fetchTickets = async () => {
    try {
      const res = await axios.get('/api/tickets');
      setTickets(res.data);
    } catch (err) {
      console.error('فشل جلب التذاكر');
    }
  };

  const applyFilters = () => {
    let result = [...tickets];
    if (filters.status) result = result.filter(t => t.status === filters.status);
    if (filters.priority) result = result.filter(t => t.priority === filters.priority);
    if (filters.department) result = result.filter(t => t.department === filters.department);
    setFilteredTickets(result);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`هل أنت متأكد من حذف التذكرة "${title}"؟`)) return;
    try {
      await axios.delete(`/api/tickets/${id}`);
      fetchTickets();
      alert('تم حذف التذكرة');
    } catch (err) {
      alert(err.response?.data?.message || 'فشل الحذف');
    }
  };

  const canDelete = user && (user.role === 'admin' || user.role === 'manager');

  // دالة مساعدة لحساب المدة
  const getDuration = (ticket) => {
    if (ticket.status === 'مكتمل' && ticket.completedAt) {
      const created = new Date(ticket.createdAt);
      const completed = new Date(ticket.completedAt);
      return Math.round((completed - created) / (1000 * 60 * 60));
    }
    return null;
  };

  // دالة لتنسيق التاريخ العربي
  const formatDate = (date) => {
    if (!date) return '--';
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-indigo-50/30 min-h-screen font-cairo">
      <div className="mb-6 flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 border-r-4 border-indigo-500 pr-3">
            جميع طلبات الصيانة
          </h2>
          <p className="text-gray-500 text-sm mt-2 mr-2">إدارة ومتابعة الطلبات</p>
        </div>
        <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm shadow-sm">
          إجمالي الطلبات: {tickets.length}
        </div>
      </div>

      {/* أزرار الفلترة – كما هي */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded-full p-1 border border-gray-200 shadow-sm">
          <button onClick={() => setFilters({...filters, status: ''})} className={`px-3 py-1.5 rounded-full text-xs font-medium ${filters.status === '' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>الكل</button>
          {['جديد', 'قيد التنفيذ', 'مكتمل', 'ملغي'].map(status => (
            <button key={status} onClick={() => setFilters({...filters, status})} className={`px-3 py-1.5 rounded-full text-xs font-medium ${filters.status === status ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>{status}</button>
          ))}
        </div>
        <div className="relative">
          <select value={filters.priority} onChange={e => setFilters({...filters, priority: e.target.value})} className="appearance-none bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-8 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value=""> كل الأولويات</option>
            <option value="عادي"> عادي</option>
            <option value="متوسط"> متوسط</option>
            <option value="عاجل"> عاجل</option>
          </select>
        </div>
        <div className="relative">
          <select value={filters.department} onChange={e => setFilters({...filters, department: e.target.value})} className="appearance-none bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-8 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value=""> كل الأقسام</option>
            <option value="صيانة"> صيانة</option>
            <option value="تكييف"> تكييف</option>
            <option value="سباكة"> سباكة</option>
            <option value="كهرباء"> كهرباء</option>
            <option value="أخرى"> أخرى</option>
          </select>
        </div>
        {(filters.status || filters.priority || filters.department) && (
          <button onClick={() => setFilters({ status: '', priority: '', department: '' })} className="text-sm text-red-500 hover:text-red-700 font-medium bg-white/60 rounded-full px-3 py-1.5">إلغاء الفلاتر</button>
        )}
      </div>

      {/* بطاقات الهواتف */}
      <div className="block md:hidden space-y-4">
        {filteredTickets.map((ticket, idx) => {
          const duration = getDuration(ticket);
          return (
            <div key={ticket._id} className="bg-white rounded-xl shadow-md p-4 animate-fadeInUp" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">#{ticket.ticketNumber}</span>
                <StatusBadge status={ticket.status} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-1">{ticket.title}</h3>
              <div className="flex flex-wrap gap-2 text-sm mb-2">
                <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{ticket.department}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ticket.priority === 'عاجل' ? 'bg-red-100 text-red-700' : ticket.priority === 'متوسط' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{ticket.priority}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mt-2">
                <div className="flex items-center gap-1"><FiCalendar className="w-3 h-3" /> {formatDate(ticket.createdAt)}</div>
                <div className="flex items-center gap-1"><FiClock className="w-3 h-3" /> {ticket.status === 'مكتمل' ? formatDate(ticket.completedAt) : '--'}</div>
                <div className="flex items-center gap-1 col-span-2"><FiUser className="w-3 h-3" /> {ticket.assignedTo?.fullName || 'غير مسند'}</div>
              </div>
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                <Link to={`/dashboard/tickets/${ticket._id}`} className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">عرض التفاصيل</Link>
                {canDelete && <button onClick={() => handleDelete(ticket._id, ticket.title)} className="text-red-500 hover:text-red-700"><MdDelete className="w-4 h-4" /></button>}
              </div>
              {ticket.status === 'مكتمل' && (
                <div className="mt-1 text-xs text-gray-500">
                  {duration !== null ? `⏱️ المدة: ${duration} ساعة` : '⏱️ المدة: لم تُسجل بعد'}
                </div>
              )}
            </div>
          );
        })}
        {filteredTickets.length === 0 && <div className="text-center py-10 text-gray-400">لا توجد طلبات صيانة حالياً</div>}
      </div>

      {/* جدول سطح المكتب */}
      <div className="hidden md:block bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-indigo-50 to-blue-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-right">#</th>
                <th className="px-4 py-3 text-right">الموضوع</th>
                <th className="px-4 py-3 text-right">القسم</th>
                <th className="px-4 py-3 text-right">الأولوية</th>
                <th className="px-4 py-3 text-right">الحالة</th>
                <th className="px-4 py-3 text-right">تاريخ الطلب</th>
                <th className="px-4 py-3 text-right">تاريخ الإنجاز</th>
                <th className="px-4 py-3 text-right">الفني</th>
                <th className="px-4 py-3 text-right">المدة (ساعة)</th>
                <th className="px-4 py-3 text-right">التفاصيل</th>
                {canDelete && <th className="px-4 py-3"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTickets.map((ticket, idx) => {
                const duration = getDuration(ticket);
                return (
                  <tr key={ticket._id} className="hover:bg-indigo-50/40 transition-colors animate-fadeInUp" style={{ animationDelay: `${idx * 50}ms` }}>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{ticket.ticketNumber}</td>
                    <td className="px-4 py-3 font-medium text-gray-800 max-w-[180px] truncate">{ticket.title}</td>
                    <td className="px-4 py-3">
                      <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full text-xs">{ticket.department}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${ticket.priority === 'عاجل' ? 'bg-red-100 text-red-700' : ticket.priority === 'متوسط' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{ticket.priority}</span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={ticket.status} /></td>
                    <td className="px-4 py-3 text-xs text-gray-600">{formatDate(ticket.createdAt)}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {ticket.status === 'مكتمل' ? formatDate(ticket.completedAt) : '--'}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{ticket.assignedTo?.fullName || 'غير مسند'}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {duration !== null ? duration : (ticket.status === 'مكتمل' ? '?' : '-')}
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/dashboard/tickets/${ticket._id}`} className="text-indigo-600 hover:text-indigo-800 font-medium">عرض</Link>
                    </td>
                    {canDelete && (
                      <td className="px-4 py-3">
                        <button onClick={() => handleDelete(ticket._id, ticket.title)} className="text-red-500 hover:text-red-700">
                          <MdDelete className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredTickets.length === 0 && <div className="text-center py-12 text-gray-400">لا توجد طلبات صيانة حالياً</div>}
      </div>
    </div>
  );
}