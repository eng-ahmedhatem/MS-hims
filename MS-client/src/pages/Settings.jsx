import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import {
  FiSave, FiArrowRight, FiBriefcase, FiCheck, FiAlertCircle
} from 'react-icons/fi';

export default function Settings() {
  const [institutionName, setInstitutionName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/settings')
      .then(res => setInstitutionName(res.data.institutionName || ''))
      .catch(() => showMessage('فشل تحميل الإعدادات', 'error'));
  }, []);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put('/api/settings', { institutionName });
      showMessage('تم حفظ الإعدادات بنجاح', 'success');
    } catch (err) {
      showMessage('فشل حفظ الإعدادات', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-cairo relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 flex items-center justify-center p-4">

      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180 z-0">
        <svg className="relative block w-full h-32 md:h-48 text-indigo-100/60" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,100 C360,200 720,0 1080,100 C1260,160 1380,120 1440,100 L1440,0 L0,0 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-lg">
     

        {/* البطاقة الرئيسية */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-6 md:p-8 animate-fadeInUp">
          {/* العنوان */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-2">
              <span className="h-10 w-2 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded-full"></span>
              إعدادات النظام
            </h2>
            <p className="text-gray-500 text-base mt-2 mr-3">
              قم بتعديل المعلومات الأساسية للنظام
            </p>
          </div>

          {/* رسالة الحالة */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-2xl text-sm font-medium flex items-center gap-2 ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.type === 'success' ? <FiCheck className="w-5 h-5" /> : <FiAlertCircle className="w-5 h-5" />}
              {message.text}
            </div>
          )}

          <div className="space-y-6">
            {/* حقل اسم المؤسسة */}
            <div>
              <label className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-2">
                <FiBriefcase className="w-4 h-4 text-indigo-500" />
                اسم المؤسسة
              </label>
              <input
                type="text"
                value={institutionName}
                onChange={e => setInstitutionName(e.target.value)}
                placeholder="مثال: شركة التقنية المحدودة"
                className="w-full p-3.5 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md transition-all"
              />
              <p className="text-xs text-gray-400 mt-1 mr-1">
                سيتم عرض هذا الاسم في جميع أنحاء النظام
              </p>
            </div>

            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all text-lg disabled:opacity-50"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              ) : (
                <FiSave className="w-5 h-5" />
              )}
              {loading ? 'جارٍ الحفظ...' : 'حفظ الإعدادات'}
            </button>
          </div>
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