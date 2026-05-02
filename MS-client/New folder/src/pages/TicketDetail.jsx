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

  const canEdit = user && (user.role === 'admin' || user.role === 'manager');
  const canDelete = user?.role === 'admin' && (ticket.status === 'مكتمل' || ticket.status === 'ملغي');

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">تفاصيل الطلب {ticket.ticketNumber}</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div><strong>مقدم الطلب:</strong> {ticket.createdBy?.name} - {ticket.createdBy?.office}</div>
        <div><strong>التاريخ:</strong> {new Date(ticket.createdAt).toLocaleDateString('ar-SA')}</div>
        <div><strong>القسم:</strong> {ticket.department}</div>
        <div><strong>الأولوية:</strong> <span className={`px-2 py-1 text-xs rounded ${ticket.priority === 'عاجل' ? 'bg-red-100 text-red-800' : ticket.priority === 'متوسط' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{ticket.priority}</span></div>
        <div className="col-span-2"><strong>الحالة:</strong> <StatusBadge status={ticket.status} /></div>
      </div>
      <div className="mb-6">
        <h3 className="font-bold">الوصف:</h3>
        <p>{ticket.description}</p>
      </div>

      {ticket.notes?.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold mb-2">الملاحظات:</h3>
          {ticket.notes.map((n, i) => (
            <div key={i} className="bg-gray-50 p-3 rounded mb-2">
              <p>{n.text}</p>
              <span className="text-xs text-gray-500">
                {new Date(n.createdAt).toLocaleString('ar-SA')}
              </span>
            </div>
          ))}
        </div>
      )}

      {canEdit && (
        <form onSubmit={handleUpdate} className="border-t pt-4">
          <h3 className="font-bold mb-3">تحديث الطلب</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <select value={status} onChange={e => setStatus(e.target.value)} className="p-2 border rounded">
              <option value="جديد">جديد</option>
              <option value="قيد المراجعة">قيد المراجعة</option>
              <option value="قيد التنفيذ">قيد التنفيذ</option>
              <option value="مكتمل">مكتمل</option>
              <option value="ملغي">ملغي</option>
            </select>
            <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} className="p-2 border rounded">
              <option value="">غير مسند</option>
              {techs.map(t => <option key={t._id} value={t._id}>{t.fullName}</option>)}
            </select>
          </div>
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="أضف ملاحظة..." className="w-full p-2 border rounded mb-3" rows="2" />
          <button type="submit" className="bg-primary text-white py-2 px-6 rounded hover:bg-secondary transition">
            حفظ التغييرات
          </button>
        </form>
      )}

      {canDelete && (
        <div className="mt-6 border-t pt-4">
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700 transition"
          >
            حذف التذكرة
          </button>
        </div>
      )}
    </div>
  );
}