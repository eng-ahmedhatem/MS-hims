import { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function Settings() {
  const [institutionName, setInstitutionName] = useState('');

  useEffect(() => {
    axios.get('/api/settings').then(res => setInstitutionName(res.data.institutionName));
  }, []);

  const handleSave = async () => {
    await axios.put('/api/settings', { institutionName });
    alert('تم الحفظ');
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 p-4 md:p-6 flex items-center justify-center animate-fadeIn">
  <div className="w-full max-w-lg mx-auto">
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* رأس البطاقة */}
      <div className="bg-gradient-to-l from-indigo-50 to-blue-50 px-6 py-5 border-b border-gray-200">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          إعدادات النظام
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          قم بتعديل المعلومات الأساسية للنظام
        </p>
      </div>

      {/* محتوى النموذج */}
      <div className="p-6 md:p-8 space-y-6">
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium text-sm md:text-base">
            اسم المؤسسة
          </label>
          <input
            type="text"
            value={institutionName}
            onChange={e => setInstitutionName(e.target.value)}
            placeholder="مثال: شركة التقنية المحدودة"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-indigo-300 hover:shadow-sm bg-white"
          />
          <p className="text-xs text-gray-400">
            سيتم عرض هذا الاسم في جميع أنحاء النظام
          </p>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          حفظ الإعدادات
        </button>
      </div>
    </div>
  </div>
</div>


  );
}