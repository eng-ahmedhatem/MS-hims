import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn, FiSearch, FiPlusCircle, FiTool } from 'react-icons/fi';
import axios from '../api/axios';

export default function HomePage() {
  const [institution, setInstitution] = useState('المعهد العالي للعلوم الإدارية ببلقاس');

  useEffect(() => {
    // محاولة جلب اسم المؤسسة إذا كان الإعداد متاحًا للعامة
    axios.get('/api/settings')
      .then(res => {
        if (res.data.institutionName) setInstitution(res.data.institutionName);
      })
      .catch(() => {}); // تجاهل الخطأ والإبقاء على الاسم الافتراضي
  }, []);

  return (
    <div className="min-h-screen font-cairo relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 flex items-center justify-center p-4">
      {/* موجات خلفية زجاجية */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg className="relative block w-full h-40 md:h-64 text-indigo-100/60" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,100 C360,200 720,0 1080,100 C1260,160 1380,120 1440,100 L1440,0 L0,0 Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180 z-0">
        <svg className="relative block w-full h-40 md:h-64 text-indigo-100/60" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,100 C360,200 720,0 1080,100 C1260,160 1380,120 1440,100 L1440,0 L0,0 Z" fill="currentColor"/>
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto text-center">
        {/* الشعار */}
        <div className="mb-8">
          <div className="inline-block p-5 bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 mb-6">
            <FiTool className="w-16 h-16 text-indigo-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
            نظام إدارة الصيانة
          </h1>
          <p className="text-xl text-gray-600 mb-2">{institution}</p>
          <p className="text-base text-gray-500 max-w-md mx-auto leading-relaxed">
            المنصة الذكية لإدارة طلبات الصيانة ومتابعتها بكل كفاءة وسهولة
          </p>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex flex-wrap gap-4 justify-center mt-10">
          <Link
            to="/login"
            className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl px-8 py-4 text-gray-800 font-bold text-lg shadow-lg hover:shadow-xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1"
          >
            <FiLogIn className="w-6 h-6 text-indigo-600" />
            تسجيل الدخول
          </Link>

          <Link
            to="/track"
            className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl px-8 py-4 text-gray-800 font-bold text-lg shadow-lg hover:shadow-xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1"
          >
            <FiSearch className="w-6 h-6 text-indigo-600" />
            متابعة طلب
          </Link>

          <Link
            to="/create"
            className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-8 py-4 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <FiPlusCircle className="w-6 h-6" />
            إنشاء طلب جديد
          </Link>
        </div>

        {/* التذييل */}
        <div className="mt-12 text-gray-400 text-sm">
          <p>تم التنفيذ بواسطة <span className="font-bold text-gray-600">م/ أحمد حاتم</span></p>
        </div>
      </div>
    </div>
  );
}