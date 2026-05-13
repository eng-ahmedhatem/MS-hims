import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { FiSend, FiChevronDown, FiCheckCircle, FiUser, FiBriefcase, FiPhone, FiFileText, FiAlertCircle, FiArrowRight } from 'react-icons/fi';

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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      console.log(err);
      alert('حدث خطأ أثناء إنشاء الطلب');
    } finally {
      setLoading(false);
    }
  };

  // حالة النجاح
  if (ticketNumber) {
    return (
      <div className="min-h-screen font-cairo relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 flex items-center justify-center p-4">
        {/* موجات خلفية */}
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

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 text-center animate-fadeInUp">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">تم إنشاء الطلب بنجاح</h2>
            <p className="text-lg text-gray-600 mb-2">رقم التذكرة الخاص بك هو</p>
            <p className="text-3xl font-bold text-indigo-600 bg-indigo-50/50 rounded-xl px-6 py-3 inline-block">{ticketNumber}</p>
            <button 
              onClick={() => navigate('/tickets')} 
              className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3.5 rounded-2xl text-lg transition-colors shadow-md flex items-center justify-center gap-2"
            >
              متابعة الطلبات
              <FiArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // نموذج الإنشاء
  return (
    <div className="min-h-screen font-cairo relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 p-4 md:p-6">
      {/* موجات خلفية زجاجية */}

      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180 z-0">
        <svg className="relative block w-full h-32 md:h-48 text-indigo-100/60" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,100 C360,200 720,0 1080,100 C1260,160 1380,120 1440,100 L1440,0 L0,0 Z" fill="currentColor"/>
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* رأس الصفحة */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-2">
            <span className="h-10 w-2 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded-full"></span>
            إنشاء طلب صيانة جديد
          </h2>
        </div>

        {/* البطاقة الرئيسية */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-6 md:p-8 animate-fadeInUp">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* معلومات مقدم الطلب */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-2">
                  <FiUser className="w-4 h-4 text-indigo-500" />
                  اسم مقدم الطلب <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: أحمد محمد"
                  className="w-full p-3.5 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md transition-all"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-2">
                  <FiBriefcase className="w-4 h-4 text-indigo-500" />
                  المكتب / القسم
                </label>
                <input
                  type="text"
                  placeholder="مثال: شئون الامتحانات"
                  className="w-full p-3.5 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md transition-all"
                  value={form.office}
                  onChange={e => setForm({ ...form, office: e.target.value })}
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-2">
                  <FiPhone className="w-4 h-4 text-indigo-500" />
                  رقم الاتصال
                </label>
                <input
                  type="tel"
                  placeholder="05xxxxxxxx"
                  className="w-full p-3.5 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md transition-all"
                  value={form.contact}
                  onChange={e => setForm({ ...form, contact: e.target.value })}
                />
              </div>
            </div>

            {/* عنوان المشكلة */}
            <div>
              <label className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-2">
                <FiAlertCircle className="w-4 h-4 text-indigo-500" />
                عنوان المشكلة <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="مثال: عطل في مكيف المكتب الرئيسي"
                className="w-full p-3.5 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md transition-all"
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
            </div>

            {/* وصف المشكلة */}
            <div>
              <label className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-2">
                <FiFileText className="w-4 h-4 text-indigo-500" />
                وصف المشكلة بالتفصيل <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="5"
                placeholder="اذكر التفاصيل مثل: الصوت الغريب، عدم التبريد بشكل كاف، تسرب المياه..."
                className="w-full p-3.5 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md transition-all resize-y"
                required
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* القسم والأولوية */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-2">
                  <FiChevronDown className="w-4 h-4 text-indigo-500" />
                  نوع الصيانة
                </label>
                <div className="relative">
                  <select
                    className="w-full p-3.5 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md appearance-none cursor-pointer transition-all"
                    value={form.department}
                    onChange={e => setForm({ ...form, department: e.target.value })}
                  >
                    <option value="صيانة">صيانة عامة</option>
                    <option value="تكييف">تكييف</option>
                    <option value="سباكة">سباكة</option>
                    <option value="كهرباء">كهرباء</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                  <FiChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-2">
                  <FiChevronDown className="w-4 h-4 text-indigo-500" />
                  الأولوية
                </label>
                <div className="relative">
                  <select
                    className="w-full p-3.5 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md appearance-none cursor-pointer transition-all"
                    value={form.priority}
                    onChange={e => setForm({ ...form, priority: e.target.value })}
                  >
                    <option value="عادي">عادي</option>
                    <option value="متوسط">متوسط</option>
                    <option value="عاجل">عاجل</option>
                  </select>
                  <FiChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                </div>
              </div>
            </div>

            {/* زر الإرسال */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden group bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    إرسال الطلب
                    <FiSend className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>


          </form>
        </div>
      </div>

      {/* أنيميشن */}
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