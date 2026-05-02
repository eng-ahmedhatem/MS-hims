import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import NeonLayout from '../components/NeonLayout';
import { MdSend, MdArrowBack } from 'react-icons/md';

export default function CreateTicket() {
  const [form, setForm] = useState({
    title: '', description: '', department: 'أخرى', priority: 'عادي',
    name: '', office: '', contact: ''
  });
  const [ticketNumber, setTicketNumber] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/tickets', {
        title: form.title, description: form.description, department: form.department,
        priority: form.priority, createdBy: { name: form.name, office: form.office, contact: form.contact }
      });
      setTicketNumber(res.data.ticketNumber);
    } catch (err) {
      alert('حدث خطأ');
    }
  };

  if (ticketNumber) {
    return (
      <NeonLayout>
        <div className="bg-white/10 backdrop-blur-xl border border-[#2170e4]/30 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">تم إنشاء الطلب بنجاح</h2>
          <p className="text-xl">رقم التذكرة: <span className="font-bold text-[#5B9BD5]">{ticketNumber}</span></p>
          <button onClick={() => navigate('/track')} className="mt-4 bg-[#2170e4] text-white py-2 px-6 rounded-xl">تتبع الطلب</button>
        </div>
      </NeonLayout>
    );
  }

  return (
    <NeonLayout>
      <div className="w-full max-w-xl relative">
        {/* زر الرجوع */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-0 right-0 md:-top-12 md:right-0 flex items-center gap-2 text-white/80 hover:text-white bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full transition-all duration-200 hover:bg-white/20 mb-4"
        >
          <MdArrowBack className="text-xl" />
          <span>رجوع</span>
        </button>

        <div className="bg-white/10 backdrop-blur-xl border border-[#2170e4]/30 rounded-2xl p-6 shadow-[0_0_25px_rgba(33,112,228,0.3)] mt-12 md:mt-0">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">طلب صيانة جديد</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input placeholder="اسمك" className="w-full p-3 bg-white/5 border border-[#2170e4]/30 rounded-xl text-white placeholder-blue-200/50" required 
                   onChange={e => setForm({...form, name: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="المكتب" className="p-3 bg-white/5 border border-[#2170e4]/30 rounded-xl text-white" 
                     onChange={e => setForm({...form, office: e.target.value})} />
              <input placeholder="رقم الاتصال" className="p-3 bg-white/5 border border-[#2170e4]/30 rounded-xl text-white" 
                     onChange={e => setForm({...form, contact: e.target.value})} />
            </div>
            <input placeholder="عنوان المشكلة" className="w-full p-3 bg-white/5 border border-[#2170e4]/30 rounded-xl text-white placeholder-blue-200/50" required 
                   onChange={e => setForm({...form, title: e.target.value})} />
            <textarea placeholder="وصف المشكلة" rows="4" className="w-full p-3 bg-white/5 border border-[#2170e4]/30 rounded-xl text-white placeholder-blue-200/50" required 
                      onChange={e => setForm({...form, description: e.target.value})} />
            <select className="w-full p-3 bg-white/5 border border-[#2170e4]/30 rounded-xl text-white" 
                    value={form.department} onChange={e => setForm({...form, department: e.target.value})}>
              <option value="صيانة">صيانة</option>
              <option value="تكييف">تكييف</option>
              <option value="سباكة">سباكة</option>
              <option value="كهرباء">كهرباء</option>
              <option value="أخرى">أخرى</option>
            </select>
            <select className="w-full p-3 bg-white/5 border border-[#2170e4]/30 rounded-xl text-white" 
                    value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
              <option value="عادي">عادي</option>
              <option value="متوسط">متوسط</option>
              <option value="عاجل">عاجل</option>
            </select>
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-[#0058be] to-[#2170e4] text-white font-bold rounded-xl shadow-lg shadow-blue-500/30">
              <MdSend className="inline ml-1" /> إرسال الطلب
            </button>
          </form>
        </div>
      </div>
    </NeonLayout>
  );
}