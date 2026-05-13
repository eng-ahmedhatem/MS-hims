import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { FiClock, FiUser, FiCalendar, FiAlertCircle } from 'react-icons/fi';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [technicianStatus, setTechnicianStatus] = useState('');
  const [techs, setTechs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTicket();
    if (user?.role === 'admin' || user?.role === 'manager') {
      axios.get('/api/users/technicians').then(res => setTechs(res.data));
    }
  }, [id]);

  const loadTicket = async () => {
    try {
      const res = await axios.get(`/api/tickets/${id}`);
      setTicket(res.data);
      setStatus(res.data.status);
      setAssignedTo(res.data.assignedTo?._id || '');
      setTechnicianStatus(res.data.technicianStatus || '');
      setError('');
    } catch (err) {
      setError('فشل تحميل التذكرة');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updateData = {};

    if (user?.role === 'admin' || user?.role === 'manager') {
      updateData.status = status;
      updateData.assignedTo = assignedTo || null;
    } else if (user?.role === 'technician' && ticket?.assignedTo?._id === user._id) {
      updateData.technicianStatus = technicianStatus || undefined;
    }

    if (note) updateData.note = note;

    try {
      await axios.put(`/api/tickets/${id}`, updateData);
      setNote('');
      alert('تم التحديث');
      loadTicket();
    } catch (err) {
      alert(err.response?.data?.message || 'فشل التحديث');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('هل أنت متأكد من حذف هذه التذكرة نهائياً؟')) return;
    try {
      await axios.delete(`/api/tickets/${id}`);
      alert('تم حذف التذكرة بنجاح');
      navigate('/dashboard/tickets');
    } catch (err) {
      alert(err.response?.data?.message || 'لا يمكن حذف التذكرة');
    }
  };

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

  if (loading) return <div className="text-center mt-10">جاري التحميل...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;
  if (!ticket) return <div className="text-center mt-10">التذكرة غير موجودة</div>;

  const isAdminOrManager = user?.role === 'admin' || user?.role === 'manager';
  const isAssignedTechnician = user?.role === 'technician' && ticket.assignedTo?._id === user._id;
  const canEdit = isAdminOrManager || isAssignedTechnician;
  const canDelete = isAdminOrManager;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-l from-indigo-50 to-blue-50 px-6 py-5 border-b border-gray-200">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              تفاصيل الطلب {ticket.ticketNumber}
            </h2>
            <StatusBadge status={ticket.status} />
          </div>
          <p className="text-gray-500 text-sm mt-1">
            تم الإنشاء في {new Date(ticket.createdAt).toLocaleDateString('ar-SA')}
          </p>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InfoField label="مقدم الطلب" value={ticket.createdBy?.name + (ticket.createdBy?.office ? ` - ${ticket.createdBy.office}` : '')} />
            <InfoField label="التاريخ" value={new Date(ticket.createdAt).toLocaleDateString('ar-SA')} />
            <InfoField label="القسم" value={ticket.department} />
            <div>
              <div className="text-sm text-gray-500 mb-1">الأولوية</div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium
                ${ticket.priority === 'عاجل' ? 'bg-red-100 text-red-700' : ''}
                ${ticket.priority === 'متوسط' ? 'bg-yellow-100 text-yellow-700' : ''}
                ${ticket.priority === 'عادي' ? 'bg-green-100 text-green-700' : ''}
              `}>{ticket.priority}</span>
            </div>
            {ticket.status === 'مكتمل' && ticket.completedAt && (
              <>
                <InfoField label="تاريخ الإنجاز" value={new Date(ticket.completedAt).toLocaleDateString('ar-SA')} />
                <InfoField label="مدة الإنجاز" value={formatDuration(ticket.createdAt, ticket.completedAt)} />
              </>
            )}
            <InfoField label="حالة الفني" value={ticket.technicianStatus || 'لم يحدد'} />
            <InfoField label="حالة مقدم الطلب" value={ticket.creatorStatus || 'لم يحدد'} />
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-bold text-gray-700 mb-2 text-lg">الوصف</h3>
            <p className="text-gray-600 leading-relaxed">{ticket.description}</p>
          </div>

          {ticket.notes?.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-gray-700 text-lg">الملاحظات</h3>
              {ticket.notes.map((n, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-md">
                  <p className="text-gray-700">{n.text}</p>
                  <span className="text-xs text-gray-400 mt-2 block">{new Date(n.createdAt).toLocaleString('ar-SA')}</span>
                </div>
              ))}
            </div>
          )}

          {canEdit && (
            <form onSubmit={handleUpdate} className="border-t border-gray-200 pt-6 space-y-5">
              <h3 className="font-bold text-gray-700 text-lg">تحديث الطلب</h3>

              {isAdminOrManager && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">الحالة</label>
                    <select value={status} onChange={e => setStatus(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500">
                      <option value="جديد">جديد</option>
                      <option value="قيد المراجعة">قيد المراجعة</option>
                      <option value="قيد التنفيذ">قيد التنفيذ</option>
                      <option value="مكتمل">مكتمل</option>
                      <option value="ملغي">ملغي</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 block mb-1">مسند إلى</label>
                    <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500">
                      <option value="">غير مسند</option>
                      {techs.map(tech => (
                        <option key={tech._id} value={tech._id}>{tech.fullName}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {isAssignedTechnician && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">حالة الفني</label>
                  <select value={technicianStatus} onChange={e => setTechnicianStatus(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500">
                    <option value="">لم يحدد</option>
                    <option value="تم الإصلاح">تم الإصلاح</option>
                    <option value="لم يتم الإصلاح">لم يتم الإصلاح</option>
                  </select>
                </div>
              )}

              <div>
                <label className="text-sm text-gray-600 block mb-1">أضف ملاحظة (اختياري)</label>
                <textarea value={note} onChange={e => setNote(e.target.value)}
                  placeholder="ملاحظات إضافية..."
                  rows="3" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500" />
              </div>

              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md">
                حفظ التغييرات
              </button>
            </form>
          )}

          {canDelete && (
            <div className="border-t border-gray-200 pt-6">
              <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md">
                حذف التذكرة
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value }) {
  return (
    <div className="border-b border-gray-100 pb-2">
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="font-medium text-gray-800">{value || '--'}</div>
    </div>
  );
}