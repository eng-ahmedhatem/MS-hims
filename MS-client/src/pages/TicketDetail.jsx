import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [techs, setTechs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTicket();
    axios.get('/api/users/technicians').then(res => setTechs(res.data));
  }, [id]);

  const loadTicket = async () => {
    try {
      const res = await axios.get(`/api/tickets/${id}`);
      setTicket(res.data);
      setStatus(res.data.status);
      setAssignedTo(res.data.assignedTo?._id || '');
      setError('');
    } catch (err) {
      setError('فشل تحميل التذكرة');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/tickets/${id}`, {
        status,
        note: note || undefined,
        assignedTo: assignedTo || null
      });
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
      navigate('/tickets');
    } catch (err) {
      alert(err.response?.data?.message || 'لا يمكن حذف التذكرة');
    }
  };

  if (loading) return <div className="text-center mt-10">جاري التحميل...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;
  if (!ticket) return <div className="text-center mt-10">التذكرة غير موجودة</div>;
const canEdit = user && (user.role === 'admin' || user.role === 'manager' || user.role === 'technician');
const canDelete = (user.role === 'admin' || user.role === 'manager') && (ticket.status === 'مكتمل' || ticket.status === 'ملغي');
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 animate-fadeIn">
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl">
    {/* رأس الصفحة */}
    <div className="bg-gradient-to-l from-indigo-50 to-blue-50 px-6 py-5 border-b border-gray-200">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          تفاصيل الطلب {ticket.ticketNumber}
        </h2>
        <div className="inline-block">
          <StatusBadge status={ticket.status} />
        </div>
      </div>
      <p className="text-gray-500 text-sm mt-1">
        تم الإنشاء في {new Date(ticket.createdAt).toLocaleDateString('ar-SA')}
      </p>
    </div>

    <div className="p-6 md:p-8 space-y-8">
      {/* المعلومات الأساسية - شبكة نظيفة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="border-b border-gray-100 pb-2 group hover:border-indigo-200 transition-colors">
          <div className="text-sm text-gray-500 mb-1 group-hover:text-indigo-600">مقدم الطلب</div>
          <div className="font-medium text-gray-800">
            {ticket.createdBy?.name || 'غير محدد'} 
            {ticket.createdBy?.office && ` - ${ticket.createdBy.office}`}
          </div>
        </div>
        <div className="border-b border-gray-100 pb-2 group hover:border-indigo-200 transition-colors">
          <div className="text-sm text-gray-500 mb-1 group-hover:text-indigo-600">التاريخ</div>
          <div className="font-medium text-gray-800">
            {new Date(ticket.createdAt).toLocaleDateString('ar-SA')}
          </div>
        </div>
        <div className="border-b border-gray-100 pb-2 group hover:border-indigo-200 transition-colors">
          <div className="text-sm text-gray-500 mb-1 group-hover:text-indigo-600">القسم</div>
          <div className="font-medium text-gray-800">{ticket.department}</div>
        </div>
        <div className="border-b border-gray-100 pb-2 group hover:border-indigo-200 transition-colors">
          <div className="text-sm text-gray-500 mb-1 group-hover:text-indigo-600">الأولوية</div>
          <div className="inline-block">
            <span className={`
              inline-block px-3 py-1 rounded-full text-sm font-medium
              ${ticket.priority === 'عاجل' ? 'bg-red-100 text-red-700' : ''}
              ${ticket.priority === 'متوسط' ? 'bg-yellow-100 text-yellow-700' : ''}
              ${ticket.priority === 'عادي' ? 'bg-green-100 text-green-700' : ''}
            `}>
              {ticket.priority}
            </span>
          </div>
        </div>
      </div>

      {/* الوصف */}
      <div className="bg-gray-50 rounded-xl p-5 transition-all hover:bg-gray-100">
        <h3 className="font-bold text-gray-700 mb-2 text-lg">الوصف</h3>
        <p className="text-gray-600 leading-relaxed">{ticket.description}</p>
      </div>

      {/* الملاحظات */}
      {ticket.notes?.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-gray-700 text-lg">الملاحظات</h3>
          <div className="space-y-3">
            {ticket.notes.map((note, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:border-indigo-200">
                <p className="text-gray-700 leading-relaxed">{note.text}</p>
                <span className="text-xs text-gray-400 mt-2 block">
                  {new Date(note.createdAt).toLocaleString('ar-SA')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* نموذج التحديث (للمستخدم المصرح له) */}
      {canEdit && (
        <form onSubmit={handleUpdate} className="border-t border-gray-200 pt-6 space-y-5">
          <h3 className="font-bold text-gray-700 text-lg">تحديث الطلب</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-sm text-gray-600 block">الحالة</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white hover:border-indigo-300"
              >
                <option value="جديد">جديد</option>
                <option value="قيد المراجعة">قيد المراجعة</option>
                <option value="قيد التنفيذ">قيد التنفيذ</option>
                <option value="مكتمل">مكتمل</option>
                <option value="ملغي">ملغي</option>
              </select>
            </div>
            {
              (user.role === 'admin' || user.role === 'manager') && ( <div className="space-y-1">
              <label className="text-sm text-gray-600 block">مسند إلى</label>
              <select
                value={assignedTo}
                onChange={e => setAssignedTo(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white hover:border-indigo-300"
              >
                <option value="">غير مسند</option>
                {techs.map(tech => (
                  <option key={tech._id} value={tech._id}>{tech.fullName}</option>
                ))}
              </select>
            </div>)
            }
           
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-600 block">أضف ملاحظة (اختياري)</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="يمكنك كتابة ملاحظة إضافية..."
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-y hover:border-indigo-300"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            حفظ التغييرات
          </button>
        </form>
      )}

      {/* زر الحذف (للمستخدم المصرح له) */}
      {canDelete && (
        <div className="border-t border-gray-200 pt-6">
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            حذف التذكرة
          </button>
        </div>
      )}
    </div>
  </div>
</div>


  );
}