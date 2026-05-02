import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function NewTicket() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    department: 'أخرى',
    priority: 'عادي',
    name: '',
    office: '',
    contact: ''
  });
  const [ticketNumber, setTicketNumber] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/tickets', {
        title: form.title,
        description: form.description,
        department: form.department,
        priority: form.priority,
        createdBy: { name: form.name, office: form.office, contact: form.contact }
      });
      setTicketNumber(res.data.ticketNumber);
    } catch (err) {
      alert('حدث خطأ أثناء إنشاء الطلب');
    }
  };

  if (ticketNumber) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">تم إنشاء الطلب بنجاح</h2>
        <p className="text-lg">رقم التذكرة: <span className="font-bold">{ticketNumber}</span></p>
        <button onClick={() => navigate(`/tickets`)} className="mt-4 bg-primary text-white py-2 px-4 rounded">
          متابعة الطلبات
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">إنشاء طلب صيانة جديد</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="اسم مقدم الطلب" className="p-3 border rounded" required 
                 value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input placeholder="المكتب / القسم" className="p-3 border rounded" 
                 value={form.office} onChange={e => setForm({...form, office: e.target.value})} />
          <input placeholder="رقم الاتصال" className="p-3 border rounded" 
                 value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} />
        </div>
        <input placeholder="عنوان المشكلة" className="w-full p-3 border rounded" required 
               value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
        <textarea placeholder="وصف المشكلة بالتفصيل" rows="4" className="w-full p-3 border rounded" required 
                  value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select className="p-3 border rounded" value={form.department} 
                  onChange={e => setForm({...form, department: e.target.value})}>
            <option value="صيانة">صيانة</option>
            <option value="تكييف">تكييف</option>
            <option value="سباكة">سباكة</option>
            <option value="كهرباء">كهرباء</option>
            <option value="أخرى">أخرى</option>
          </select>
          <select className="p-3 border rounded" value={form.priority} 
                  onChange={e => setForm({...form, priority: e.target.value})}>
            <option value="عادي">عادي</option>
            <option value="متوسط">متوسط</option>
            <option value="عاجل">عاجل</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-secondary transition">
          إرسال الطلب
        </button>
      </form>
    </div>
  );
}