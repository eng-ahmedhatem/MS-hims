import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { PencilIcon, ChevronDownIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

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
      console.log(err)
      console.log("first")
      // alert('حدث خطأ أثناء إنشاء الطلب');
    }
  };

  if (ticketNumber) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg text-center font-cairo">
        <h2 className="text-2xl font-bold text-green-600 mb-4">تم إنشاء الطلب بنجاح</h2>
        <p className="text-lg">رقم التذكرة: <span className="font-bold">{ticketNumber}</span></p>
        <button onClick={() => navigate(`/tickets`)} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition-all">
          متابعة الطلبات
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 animate-fadeIn font-cairo">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
        {/* الرأس */}
        <div className="bg-gradient-to-l from-indigo-600 to-blue-600 px-6 py-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            إنشاء طلب صيانة جديد
          </h2>
          <p className="text-indigo-100 text-sm mt-1">يرجى ملء البيانات بدقة لتتم معالجتك بأسرع وقت</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {/* الحقول الأساسية */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-indigo-600 transition-colors">
                اسم مقدم الطلب <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="مثال: أحمد محمد"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 group-hover:border-indigo-300"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
              <PencilIcon className="absolute left-3 top-10 w-4 h-4 text-gray-400 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all" />
            </div>

            <div className="relative group">
              <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-indigo-600 transition-colors">
                المكتب / القسم
              </label>
              <input
                type="text"
                placeholder="مثال: شئون الإمتحانات"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 group-hover:border-indigo-300"
                value={form.office}
                onChange={e => setForm({ ...form, office: e.target.value })}
              />
            </div>

            <div className="relative group">
              <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-indigo-600 transition-colors">
                رقم الاتصال
              </label>
              <input
                type="tel"
                placeholder="05xxxxxxxx"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 group-hover:border-indigo-300"
                value={form.contact}
                onChange={e => setForm({ ...form, contact: e.target.value })}
              />
            </div>
          </div>

          {/* عنوان المشكلة */}
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-indigo-600 transition-colors">
              عنوان المشكلة <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="مثال: عطل في مكيف المكتب الرئيسي"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 group-hover:border-indigo-300"
              required
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* وصف المشكلة */}
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-indigo-600 transition-colors">
              وصف المشكلة بالتفصيل <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="4"
              placeholder="اذكر التفاصيل مثل: الصوت الغريب، عدم التبريد بشكل كاف، تسرب المياه..."
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-y group-hover:border-indigo-300"
              required
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* القسم والأولوية */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-indigo-600 transition-colors">
                نوع الصيانة
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-all group-hover:border-indigo-300"
                value={form.department}
                onChange={e => setForm({ ...form, department: e.target.value })}
              >
                <option value="صيانة">صيانة عامة</option>
                <option value="تكييف">تكييف</option>
                <option value="سباكة">سباكة</option>
                <option value="كهرباء">كهرباء</option>
                <option value="أخرى">أخرى</option>
              </select>
              <ChevronDownIcon className="absolute left-3 top-10 w-4 h-4 text-gray-400 group-hover:text-indigo-400 transition-colors pointer-events-none" />
            </div>

            <div className="relative group">
              <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-indigo-600 transition-colors">
                الأولوية
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-all group-hover:border-indigo-300"
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
              >
                <option value="عادي">عادي</option>
                <option value="متوسط">متوسط</option>
                <option value="عاجل">عاجل</option>
              </select>
              <ChevronDownIcon className="absolute left-3 top-10 w-4 h-4 text-gray-400 group-hover:text-indigo-400 transition-colors pointer-events-none" />
            </div>
          </div>

          {/* زر الإرسال */}
          <button
            type="submit"
            className="w-full relative overflow-hidden group bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              إرسال الطلب
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>

          <p className="text-xs text-gray-400 text-center mt-2">
            * الحقول المطلوبة. سيتم الرد عليك خلال 24 ساعة.
          </p>
        </form>
      </div>
    </div>
  );
}