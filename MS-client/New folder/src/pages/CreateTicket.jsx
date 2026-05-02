import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function CreateTicket() {
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
      alert('حدث خطأ');
    }
  };

  if (ticketNumber) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">تم إنشاء الطلب بنجاح</h2>
        <p className="text-lg">رقم التذكرة: <span className="font-bold">{ticketNumber}</span></p>
        <button onClick={() => navigate('/track')} className="mt-4 bg-primary text-white py-2 px-4 rounded">تتبع الطلب</button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-6">تقديم طلب صيانة جديد</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="اسمك" className="w-full p-2 mb-3 border rounded" required onChange={e => setForm({...form, name: e.target.value})} />
        <input placeholder="المكتب/القسم" className="w-full p-2 mb-3 border rounded" onChange={e => setForm({...form, office: e.target.value})} />
        <input placeholder="رقم الاتصال" className="w-full p-2 mb-3 border rounded" onChange={e => setForm({...form, contact: e.target.value})} />
        <input placeholder="عنوان المشكلة" className="w-full p-2 mb-3 border rounded" required onChange={e => setForm({...form, title: e.target.value})} />
        <textarea placeholder="وصف المشكلة" rows="4" className="w-full p-2 mb-3 border rounded" required onChange={e => setForm({...form, description: e.target.value})} />
        <select className="w-full p-2 mb-3 border rounded" value={form.department} onChange={e => setForm({...form, department: e.target.value})}>
          <option value="صيانة">صيانة</option>
          <option value="تكييف">تكييف</option>
          <option value="سباكة">سباكة</option>
          <option value="كهرباء">كهرباء</option>
          <option value="أخرى">أخرى</option>
        </select>
        <select className="w-full p-2 mb-6 border rounded" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
          <option value="عادي">عادي</option>
          <option value="متوسط">متوسط</option>
          <option value="عاجل">عاجل</option>
        </select>
        <button type="submit" className="w-full bg-primary text-white py-2 rounded">إرسال الطلب</button>
      </form>
    </div>
  );
}