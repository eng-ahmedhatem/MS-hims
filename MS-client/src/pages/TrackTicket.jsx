import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { FiRefreshCw, FiTrash2, FiSearch, FiUser, FiClock, FiAlertCircle, FiArrowRight } from 'react-icons/fi';

export default function TrackTicket() {
  const [ticketNumber, setTicketNumber] = useState('');
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');
  const [creatorStatus, setCreatorStatus] = useState('');
  const navigate = useNavigate();

  const handleTrack = async () => {
    if (!ticketNumber.trim()) {
      setError('يرجى إدخال رقم التذكرة');
      return;
    }
    try {
      const res = await axios.get(`/api/tickets/track/${ticketNumber}`);
      setTicket(res.data);
      setCreatorStatus(res.data.creatorStatus || '');
      setError('');
    } catch (err) {
      setError('الطلب غير موجود');
      setTicket(null);
    }
  };

  const handleUpdateCreatorStatus = async () => {
    if (!creatorStatus) return;
    try {
      const res = await axios.put(`/api/tickets/track/${ticket.ticketNumber}`, { creatorStatus });
      setTicket(res.data);
      alert('تم تحديث حالتك');
    } catch (err) {
      alert(err.response?.data?.message || 'فشل التحديث');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('هل أنت متأكد من حذف هذه التذكرة؟')) return;
    try {
      await axios.delete(`/api/tickets/track/${ticket.ticketNumber}`);
      setTicket(null);
      setTicketNumber('');
      alert('تم حذف التذكرة');
    } catch (err) {
      alert(err.response?.data?.message || 'لا يمكن حذف التذكرة');
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

  return (
    <div className="min-h-screen font-cairo relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 flex items-center justify-center p-4">
      {/* موجات خلفية زجاجية */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg className="relative block w-full h-32 md:h-48 text-indigo-100/60" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,100 C360,200 720,0 1080,100 C1260,160 1380,120 1440,100 L1440,0 L0,0 Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180 z-0">
        <svg className="relative block w-full h-32 md:h-48 text-indigo-100/60" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,100 C360,200 720,0 1080,100 C1260,160 1380,120 1440,100 L1440,0 L0,0 Z" fill="currentColor"/>
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* البطاقة الرئيسية */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-6 md:p-8 relative">
          {/* زر الرجوع */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 p-2 bg-white/70 backdrop-blur-sm rounded-xl border border-white/60 shadow-md text-gray-500 hover:text-indigo-600 hover:bg-white/90 transition-colors"
            title="رجوع"
          >
            <FiArrowRight className="w-5 h-5" />
          </button>

          {/* العنوان */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <span className="h-8 w-1.5 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded-full"></span>
              تتبع طلب صيانة
            </h2>
            <p className="text-gray-500 text-sm mt-2 mr-3">أدخل رقم التذكرة للاطلاع على التفاصيل</p>
          </div>

          {/* حقل الإدخال وزر البحث */}
          <div className="flex gap-2 mb-6">
            <div className="flex-1 relative">
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={ticketNumber}
                onChange={e => setTicketNumber(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleTrack()}
                placeholder="مثال: 2024-001"
                className="w-full pr-10 pl-4 py-3 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md"
              />
            </div>
            <button 
              onClick={handleTrack} 
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-medium text-base transition-colors shadow-md flex items-center gap-2"
            >
              <FiSearch className="w-5 h-5" />
              بحث
            </button>
          </div>

          {/* رسالة الخطأ */}
          {error && (
            <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* تفاصيل التذكرة */}
          {ticket && (
            <div className="space-y-5 animate-fadeInUp">
              {/* بطاقة المعلومات الأساسية */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/60 space-y-4">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <span className="font-mono text-base text-gray-500 bg-gray-100/80 px-3 py-1 rounded-full">
                    #{ticket.ticketNumber}
                  </span>
                  <StatusBadge status={ticket.status} />
                </div>

                <h3 className="text-xl font-bold text-gray-800">{ticket.title}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400 text-xs block mb-0.5">مقدم الطلب</span>
                    <span className="text-gray-800 font-medium flex items-center gap-1.5">
                      <FiUser className="w-4 h-4 text-indigo-400" />
                      {ticket.createdBy?.name || 'غير معروف'}
                    </span>
                  </div>
                  {ticket.assignedTo && (
                    <div>
                      <span className="text-gray-400 text-xs block mb-0.5">مسند إلى</span>
                      <span className="text-gray-800 font-medium flex items-center gap-1.5">
                        <FiUser className="w-4 h-4 text-indigo-400" />
                        {ticket.assignedTo.fullName}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400 text-xs block mb-0.5">تاريخ الطلب</span>
                    <span className="text-gray-800 font-medium flex items-center gap-1.5">
                      <FiClock className="w-4 h-4 text-indigo-400" />
                      {formatDate(ticket.createdAt)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block mb-0.5">حالة الفني</span>
                    <span className="text-gray-800 font-medium">{ticket.technicianStatus || 'لم يحدد بعد'}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-400 text-xs block mb-0.5">حالتك (كمقدم طلب)</span>
                    <span className="text-gray-800 font-medium">{ticket.creatorStatus || 'لم تحدد بعد'}</span>
                  </div>
                </div>
              </div>

              {/* قسم تحديث حالة المستخدم (يظهر إذا كانت التذكرة نشطة) */}
              {(ticket.status !== 'مكتمل' && ticket.status !== 'ملغي') && (
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/60 space-y-4">
                  <h4 className="text-base font-semibold text-gray-700">تحديث حالتك</h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={creatorStatus}
                      onChange={e => setCreatorStatus(e.target.value)}
                      className="flex-1 p-3 bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">اختر حالتك</option>
                      <option value="تم الإصلاح">تم الإصلاح</option>
                      <option value="لم يتم الإصلاح">لم يتم الإصلاح</option>
                    </select>
                    <button
                      onClick={handleUpdateCreatorStatus}
                      disabled={!creatorStatus}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-3 rounded-2xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <FiRefreshCw className="w-4 h-4" />
                      تحديث
                    </button>
                  </div>
                </div>
              )}

              {/* زر الحذف – متاح دائمًا بغض النظر عن حالة التذكرة */}
              <button
                onClick={handleDelete}
                className="w-full bg-red-50/80 hover:bg-red-100 text-red-600 py-3 rounded-2xl font-medium text-sm transition-colors border border-red-200 flex items-center justify-center gap-2"
              >
                <FiTrash2 className="w-4 h-4" />
                حذف التذكرة
              </button>
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