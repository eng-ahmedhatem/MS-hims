import { Link } from 'react-router-dom';
import { MdLogin, MdSearch, MdAddCircle, MdEngineering } from 'react-icons/md';

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0a1929] via-[#0d2137] to-[#001a42] font-almarai">
      {/* تأثيرات نيون خلفية */}
      <div className="absolute top-0 -left-40 w-[600px] h-[600px] bg-[#0058be] opacity-30 blur-[100px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-0 -right-40 w-[600px] h-[600px] bg-[#2170e4] opacity-20 blur-[100px] rounded-full animate-pulse delay-1000"></div>

      {/* خطوط شبكة تقنية */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* الشعار والعنوان */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white/10 backdrop-blur-xl rounded-3xl shadow-[0_0_30px_rgba(0,88,190,0.3)] mb-6">
            <MdEngineering className="text-6xl text-[#5B9BD5] drop-shadow-[0_0_10px_rgba(33,112,228,0.8)]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
            نظام <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B9BD5] to-[#2170e4]">إدارة الصيانة <br></br> - المعهد العالي للعلوم الإدارية ببلقاس</span>
          </h1>
          <p className="text-lg text-[#a0c4e8] max-w-xl mx-auto leading-relaxed">
            المنصة الذكية لإدارة طلبات الصيانة ومتابعتها بكل كفاءة وسهولة
          </p>
        </div>

        {/* أزرار الإجراءات الرئيسية */}
        <div className="flex flex-wrap gap-6 justify-center mt-8">
          <Link
            to="/login"
            className="group relative px-8 py-4 bg-white/10 backdrop-blur-xl border border-[#2170e4]/40 rounded-2xl text-white font-bold text-lg hover:bg-[#2170e4]/20 transition-all duration-300 shadow-[0_0_20px_rgba(33,112,228,0.2)] hover:shadow-[0_0_40px_rgba(33,112,228,0.4)] hover:border-[#5B9BD5] hover:-translate-y-1"
          >
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#0058be] to-[#2170e4] opacity-0 group-hover:opacity-20 transition-opacity"></span>
            <MdLogin className="inline-block ml-2 text-2xl" />
            تسجيل الدخول
          </Link>

          <Link
            to="/track"
            className="group relative px-8 py-4 bg-white/10 backdrop-blur-xl border border-[#2170e4]/40 rounded-2xl text-white font-bold text-lg hover:bg-[#2170e4]/20 transition-all duration-300 shadow-[0_0_20px_rgba(33,112,228,0.2)] hover:shadow-[0_0_40px_rgba(33,112,228,0.4)] hover:border-[#5B9BD5] hover:-translate-y-1"
          >
            <MdSearch className="inline-block ml-2 text-2xl" />
            متابعة طلب
          </Link>

          <Link
            to="/create"
            className="group relative px-8 py-4 bg-gradient-to-r from-[#0058be] to-[#2170e4] backdrop-blur-xl border border-[#5B9BD5]/50 rounded-2xl text-white font-bold text-lg hover:from-[#2170e4] hover:to-[#0058be] transition-all duration-300 shadow-[0_0_30px_rgba(33,112,228,0.4)] hover:shadow-[0_0_50px_rgba(33,112,228,0.7)] hover:scale-105"
          >
            <MdAddCircle className="inline-block ml-2 text-2xl" />
            إنشاء طلب جديد
          </Link>
        </div>

        {/* تذييل المصمم */}
        <div className="absolute bottom-6 text-center text-[#a0c4e8]/70 text-sm">
          <p>تم التنفيذ بواسطة <span className="font-bold text-white">م/ أحمد حاتم</span></p>
        </div>
      </div>
    </div>
  );
}