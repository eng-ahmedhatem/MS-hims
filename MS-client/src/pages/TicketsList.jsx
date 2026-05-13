import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { MdDelete } from 'react-icons/md';
import { FiClock, FiUser, FiCalendar, FiAlertCircle, FiBarChart2, FiLayers, FiCheckCircle, FiXCircle, FiEye } from 'react-icons/fi';

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
      let allTickets = res.data;
      if (user?.role === 'technician') {
        allTickets = allTickets.filter(ticket => ticket.assignedTo?._id === user._id);
      }
      setTickets(allTickets);
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

  const formatDuration = (start, end) => {
    if (!end) return null;
    const diffMs = new Date(end) - new Date(start);
    if (diffMs <= 0) return null;
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffHours / 24;

    if (diffHours < 24) return Math.round(diffHours) + ' ساعة';
    else if (diffDays < 7) return Math.round(diffDays) + ' يوم';
    else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      const remainDays = Math.round(diffDays % 7);
      return remainDays > 0 ? `${weeks} أسبوع و ${remainDays} يوم` : `${weeks} أسبوع`;
    } else {
      const months = Math.floor(diffDays / 30);
      const remainDays = Math.round(diffDays % 30);
      return remainDays > 0 ? `${months} شهر و ${remainDays} يوم` : `${months} شهر`;
    }
  };

  const formatDate = (date) => {
    if (!date) return '--';
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDurationBadge = (start, end) => {
    if (!end) return null;
    const diffHours = (new Date(end) - new Date(start)) / (1000 * 60 * 60);
    if (diffHours > 48) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 mr-1">
          <FiAlertCircle className="w-4 h-4 ml-1" />
          مطوّل
        </span>
      );
    }
    return null;
  };

  const stats = {
    total: tickets.length,
    new: tickets.filter(t => t.status === 'جديد').length,
    inProgress: tickets.filter(t => t.status === 'قيد التنفيذ' || t.status === 'قيد المراجعة').length,
    completed: tickets.filter(t => t.status === 'مكتمل').length,
    cancelled: tickets.filter(t => t.status === 'ملغي').length,
  };

  return (
    <div className="min-h-screen font-cairo relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      {/* موجات خلفية زجاجية */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg className="relative block w-full h-40 md:h-60 text-indigo-100/60" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,100 C360,200 720,0 1080,100 C1260,160 1380,120 1440,100 L1440,0 L0,0 Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180 z-0">
        <svg className="relative block w-full h-40 md:h-60 text-indigo-100/60" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,100 C360,200 720,0 1080,100 C1260,160 1380,120 1440,100 L1440,0 L0,0 Z" fill="currentColor"/>
        </svg>
      </div>

      <div className="relative z-10 p-4 md:p-6">
        {/* رأس الصفحة */}
        <div className="mb-8 flex flex-wrap justify-between items-center gap-3">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-2">
              <span className="h-10 w-2 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded-full"></span>
              {user?.role === 'technician' ? 'طلباتي المسندة' : 'جميع طلبات الصيانة'}
            </h2>
            <p className="text-gray-500 text-base mt-2 mr-3">
              {user?.role === 'technician' ? 'الطلبات التي كُلفت بها' : 'إدارة ومتابعة الطلبات'}
            </p>
          </div>
        </div>

        {/* المربعات الإحصائية */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-white/80 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-100 rounded-xl"><FiBarChart2 className="w-6 h-6 text-indigo-600" /></div>
              <div>
                <p className="text-sm text-gray-500">الإجمالي</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-white/80 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 rounded-xl"><FiLayers className="w-6 h-6 text-blue-600" /></div>
              <div>
                <p className="text-sm text-gray-500">جديد</p>
                <p className="text-2xl font-bold text-gray-800">{stats.new}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-white/80 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-yellow-100 rounded-xl"><FiClock className="w-6 h-6 text-yellow-600" /></div>
              <div>
                <p className="text-sm text-gray-500">قيد التنفيذ</p>
                <p className="text-2xl font-bold text-gray-800">{stats.inProgress}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-white/80 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-100 rounded-xl"><FiCheckCircle className="w-6 h-6 text-green-600" /></div>
              <div>
                <p className="text-sm text-gray-500">مكتمل</p>
                <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-white/80 shadow-lg hover:shadow-xl transition-all col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-100 rounded-xl"><FiXCircle className="w-6 h-6 text-red-600" /></div>
              <div>
                <p className="text-sm text-gray-500">ملغي</p>
                <p className="text-2xl font-bold text-gray-800">{stats.cancelled}</p>
              </div>
            </div>
          </div>
        </div>

        {/* أزرار الفلترة الزجاجية */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md rounded-full p-1.5 border border-white/60 shadow-md">
            <button onClick={() => setFilters({...filters, status: ''})} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filters.status === '' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100/80'}`}>الكل</button>
            {['جديد', 'قيد التنفيذ', 'مكتمل', 'ملغي'].map(status => (
              <button key={status} onClick={() => setFilters({...filters, status})} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filters.status === status ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100/80'}`}>{status}</button>
            ))}
          </div>
          <div className="relative">
            <select value={filters.priority} onChange={e => setFilters({...filters, priority: e.target.value})} className="appearance-none bg-white/80 backdrop-blur-md border border-white/60 rounded-full px-10 py-2.5 text-sm text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value=""> كل الأولويات</option>
              <option value="عادي"> عادي</option>
              <option value="متوسط"> متوسط</option>
              <option value="عاجل"> عاجل</option>
            </select>
          </div>
          <div className="relative">
            <select value={filters.department} onChange={e => setFilters({...filters, department: e.target.value})} className="appearance-none bg-white/80 backdrop-blur-md border border-white/60 rounded-full px-10 py-2.5 text-sm text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value=""> كل الأقسام</option>
              <option value="صيانة"> صيانة</option>
              <option value="تكييف"> تكييف</option>
              <option value="سباكة"> سباكة</option>
              <option value="كهرباء"> كهرباء</option>
              <option value="أخرى"> أخرى</option>
            </select>
          </div>
          {(filters.status || filters.priority || filters.department) && (
            <button onClick={() => setFilters({ status: '', priority: '', department: '' })} className="text-sm text-red-500 hover:text-red-700 font-medium bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">إلغاء الفلاتر</button>
          )}
        </div>

        {/* عرض الهواتف (بطاقات محسنة الخطوط) */}
        <div className="block md:hidden space-y-4">
          {filteredTickets.map((ticket, idx) => {
            const duration = formatDuration(ticket.createdAt, ticket.completedAt);
            return (
              <div key={ticket._id} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-5 border border-white/50 animate-fadeInUp" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="flex justify-between items-start mb-3">
                  <span className="font-mono text-sm text-gray-500 bg-gray-100/80 px-3 py-1 rounded-lg">الرقم التعريفي :  {ticket.ticketNumber}</span>
                  <StatusBadge status={ticket.status} />
                </div>
                <h3 className="font-bold text-gray-800 text-xl mb-2">{ticket.title}</h3>
                <div className="flex flex-wrap gap-2 text-sm mb-3">
                  <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">{ticket.department}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${ticket.priority === 'عاجل' ? 'bg-red-100 text-red-700' : ticket.priority === 'متوسط' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{ticket.priority}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-3">
                  <div className="flex items-center gap-1.5"><FiCalendar className="w-4 h-4" /> {formatDate(ticket.createdAt)}</div>
                  <div className="flex items-center gap-1.5"><FiClock className="w-4 h-4" /> {ticket.status === 'مكتمل' ? formatDate(ticket.completedAt) : '--'}</div>
                  <div className="flex items-center gap-1.5 col-span-2"><FiUser className="w-4 h-4" /> {ticket.assignedTo?.fullName || 'غير مسند'}</div>
                </div>
                {ticket.status === 'مكتمل' && duration && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg">{duration}</span>
                    {getDurationBadge(ticket.createdAt, ticket.completedAt)}
                  </div>
                )}
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200/50">
                  <Link to={`/dashboard/tickets/${ticket._id}`} className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 text-sm">عرض التفاصيل</Link>
                  {canDelete && (
                    <button onClick={() => handleDelete(ticket._id, ticket.title)} className="text-red-500 hover:text-red-700">
                      <MdDelete className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {filteredTickets.length === 0 && <div className="text-center py-10 text-gray-400 text-base">لا توجد طلبات صيانة حالياً</div>}
        </div>

        {/* سطح المكتب: بطاقات منظمة بخطوط كبيرة */}
        <div className="hidden md:grid grid-cols-1 xl:grid-cols-2 gap-5">
          {filteredTickets.map((ticket, idx) => {
            const duration = formatDuration(ticket.createdAt, ticket.completedAt);
            return (
              <div 
                key={ticket._id} 
                className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-6 flex flex-col animate-fadeInUp hover:shadow-2xl transition-all"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* الصف الأول: رقم الطلب والحالة */}
                <div className="flex justify-between items-start mb-5">
                  <span className="font-mono text-sm text-gray-500 bg-gray-100/80 px-4 py-1.5 rounded-full">الرقم التعريفي :  {ticket.ticketNumber}</span>
                  <StatusBadge status={ticket.status} />
                </div>

                {/* الموضوع */}
                <h3 className="font-bold text-gray-800 text-xl mb-5 leading-tight line-clamp-2" title={ticket.title}>
                  {ticket.title}
                </h3>

                {/* شبكة المعلومات المنظمة (كل حقل بعنوان واضح وخطوط أكبر) */}
                <div className="grid grid-cols-2 gap-x-5 gap-y-4 text-sm mb-5">
                  <div>
                    <span className="text-gray-400 block mb-1 text-sm">القسم</span>
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium inline-block">{ticket.department}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1 text-sm">الأولوية</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
                      ticket.priority === 'عاجل' ? 'bg-red-100 text-red-700' : 
                      ticket.priority === 'متوسط' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-green-100 text-green-700'
                    }`}>{ticket.priority}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1 text-sm">تاريخ الطلب</span>
                    <span className="text-gray-700 flex items-center gap-1.5 text-sm"><FiCalendar className="w-4 h-4 text-indigo-400" /> {formatDate(ticket.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1 text-sm">تاريخ الإنجاز</span>
                    <span className="text-gray-700 flex items-center gap-1.5 text-sm">
                      <FiClock className="w-4 h-4 text-indigo-400" />
                      {ticket.status === 'مكتمل' ? formatDate(ticket.completedAt) : '--'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400 block mb-1 text-sm">الفني المسند</span>
                    <span className="text-gray-700 flex items-center gap-1.5 text-sm"><FiUser className="w-4 h-4 text-indigo-400" /> {ticket.assignedTo?.fullName || 'غير مسند'}</span>
                  </div>
                  {ticket.status === 'مكتمل' && duration && (
                    <div className="col-span-2">
                      <span className="text-gray-400 block mb-1 text-sm">المدة المستغرقة لإنجاز الطلب</span>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-700 font-medium">{duration}</span>
                        {getDurationBadge(ticket.createdAt, ticket.completedAt)}
                      </div>
                    </div>
                  )}
                </div>

                {/* الإجراءات: عرض التفاصيل + حذف + تغيير الحالة */}
                <div className="mt-auto pt-5 border-t border-gray-200/50 flex flex-wrap items-center justify-between gap-3">
                  <Link 
                    to={`/dashboard/tickets/${ticket._id}`} 
                    className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50/80 rounded-lg px-4 py-2 text-sm transition-colors"
                  >
                    <FiEye className="w-4 h-4" />
                    عرض التفاصيل
                  </Link>
                  
                  <div className="flex items-center gap-3">
                    {canDelete && (
                      <button 
                        onClick={() => handleDelete(ticket._id, ticket.title)} 
                        className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <MdDelete className="w-5 h-5" />
                      </button>
                    )}
                    {user.role !== 'technician' ? (
                      <select
                        value={ticket.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          try {
                            await axios.put(`/api/tickets/${ticket._id}`, { status: newStatus });
                            fetchTickets();
                          } catch (err) {
                            alert('فشل التحديث');
                          }
                        }}
                        className="text-sm border border-white/60 bg-white/70 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md focus:ring-2 focus:ring-indigo-300"
                      >
                        <option value="جديد">جديد</option>
                        <option value="قيد المراجعة">قيد المراجعة</option>
                        <option value="قيد التنفيذ">قيد التنفيذ</option>
                        <option value="مكتمل">مكتمل</option>
                        <option value="ملغي">ملغي</option>
                      </select>
                    ) : (
                      <span className="text-sm text-gray-400">صلاحية محدودة</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {filteredTickets.length === 0 && (
            <div className="col-span-full text-center py-16 text-gray-400 bg-white/40 backdrop-blur-md rounded-3xl border border-white/50 text-base">
              لا توجد طلبات صيانة حالياً
            </div>
          )}
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