export default function NeonLayout({ children }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0a1929] via-[#0d2137] to-[#001a42] font-almarai">
      {/* تأثيرات النيون */}
      <div className="absolute top-0 -left-40 w-[600px] h-[600px] bg-[#0058be] opacity-30 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-0 -right-40 w-[600px] h-[600px] bg-[#2170e4] opacity-20 blur-[100px] rounded-full"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      {/* محتوى الصفحة */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-10">
        {children}
      </div>
    </div>
  );
}