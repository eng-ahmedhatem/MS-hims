import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { FiDownload, FiPieChart, FiBarChart2, FiPrinter, FiCheckCircle, FiClock, FiActivity, FiLayers } from 'react-icons/fi';

const COLORS = ['#4f46e5', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

// تنسيق المدة الذكية
const formatDuration = (start, end) => {
  if (!end) return null;
  const diffMs = new Date(end) - new Date(start);
  if (diffMs <= 0) return null;
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;
  if (diffHours < 24) return Math.round(diffHours) + ' ساعة';
  else if (diffDays < 7) return Math.round(diffDays) + ' يوم';
  else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    const remainDays = Math.round(diffDays % 7);
    return remainDays > 0 ? `${weeks} أسبوع و ${remainDays} يوم` : `${weeks} أسبوع`;
  } else {
    const months = Math.floor(diffDays / 30);
    const remainDays = Math.round(diffDays % 30);
    return remainDays > 0 ? `${months} شهر و ${remainDays} يوم` : `${months} شهر`;
  }
};

const CustomLegend = ({ payload }) => {
  if (!payload) return null;
  const total = payload.reduce((sum, entry) => sum + entry.payload.value, 0);
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center gap-2 text-sm text-gray-700">
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <span>{entry.value}: {((entry.payload.value / total) * 100).toFixed(0)}%</span>
        </div>
      ))}
    </div>
  );
};

export default function Reports() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [reportType, setReportType] = useState('monthly');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [techStats, setTechStats] = useState([]);

  useEffect(() => {
    axios.get('/api/dashboard/stats').then(res => setStats(res.data)).catch(console.error);
  }, []);

  const downloadReport = async () => {
    setLoadingPdf(true);
    try {
      const endpoint = reportType === 'monthly'
        ? `/api/reports/monthly?month=${month}&year=${year}`
        : `/api/reports/yearly?year=${year}`;
      const res = await axios.get(endpoint);
      const report = res.data;
      setTechStats(report.summary.techStats || []);
      const title = reportType === 'monthly'
        ? `التقرير الشهري - ${report.month}/${report.year}`
        : `التقرير السنوي - ${report.year}`;

      const techRows = report.summary.techStats?.map(tech => `
        <tr>
          <td>${tech.name}</td>
          <td>${tech.total}</td>
          <td>${tech.completed}</td>
          <td>${tech.avgHours} ساعة</td>
        </tr>
      `).join('') || '';

      const htmlContent = `<!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head><meta charset="utf-8"><title>تقرير</title>
        <style>@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
          *{margin:0;padding:0;box-sizing:border-box}@page{size:A4;margin:0}
          body{font-family:'Cairo',sans-serif;direction:rtl;background:#fff;color:#1E293B;width:100%;max-width:210mm;margin:0 auto;padding:8mm 6mm;font-size:10pt}
          .header{text-align:center;border-bottom:2px solid #4f46e5;padding-bottom:3mm;margin-bottom:4mm}
          .header h1{color:#4f46e5;font-size:18pt;margin-bottom:1mm}
          .header h2{color:#475569;font-weight:400;font-size:12pt}
          table{width:100%;border-collapse:collapse;margin-bottom:5mm;font-size:7pt;word-break:break-all}
          th,td{border:1px solid #CBD5E1;padding:3px 2px;text-align:center;font-size:7pt}
          th{background-color:#4f46e5;color:white;font-weight:bold}
          .summary{background:#F8FAFC;border-radius:3mm;padding:4mm;margin-bottom:4mm}
          .footer{margin-top:6mm;text-align:center;font-size:7pt;color:#94A3B8;border-top:1px solid #CBD5E1;padding-top:2mm}
        </style></head>
        <body>
          <div class="header"><h1>نظام إدارة الصيانة</h1><h2>${title}</h2></div>
          <p>تاريخ الإصدار: ${new Date().toLocaleDateString('ar-SA')} | عدد الطلبات: ${report.summary.total}</p>
          <table><thead><tr><th>#</th><th>الموضوع</th><th>القسم</th><th>الأولوية</th><th>الحالة</th><th>الفني</th><th>المدة</th></tr></thead><tbody>
            ${report.tickets.map(ticket => `
              <tr>
                <td>${ticket.ticketNumber}</td><td>${ticket.title}</td><td>${ticket.department}</td>
                <td>${ticket.priority}</td><td>${ticket.status}</td>
                <td>${ticket.assignedTo?.fullName || 'غير محدد'}</td>
                <td>${ticket.durationHours !== null ? formatDuration(ticket.startDate, ticket.endDate) : '-'}</td>
              </tr>`).join('')}
          </tbody></table>
          <div class="summary">
            <p>مكتملة: ${report.summary.completed} | قيد التنفيذ: ${report.summary.inProgress} | ملغاة: ${report.summary.cancelled}</p>
            <p>نسبة الإنجاز: ${report.summary.completionRate}%</p>
          </div>
          ${techRows ? `<h3>أداء الفنيين</h3><table><tr><th>الفني</th><th>الإجمالي</th><th>منجز</th><th>متوسط الوقت</th></tr>${techRows}</table>` : ''}
          <div class="footer">تم إنشاؤه بواسطة نظام إدارة الصيانة - ${year}</div>
          <script>window.onload = () => window.print();</script>
        </body></html>`;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } catch (err) {
      console.error(err);
      alert('فشل تحميل التقرير. تأكد من تحديد شهر وسنة صحيحين.');
    } finally {
      setLoadingPdf(false);
    }
  };

  if (!stats) return (
    <div className="min-h-screen font-cairo bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 flex items-center justify-center">
      <p className="text-xl text-gray-500">جاري تحميل الإحصائيات...</p>
    </div>
  );

  const pieData = [
    { name: 'مكتمل', value: stats.completed },
    { name: 'قيد التنفيذ', value: stats.inProgress },
    { name: 'جديد/مراجعة', value: stats.total - stats.completed - stats.inProgress },
  ];

  const barData = [
    { name: 'الإجمالي', count: stats.total },
    { name: 'مكتملة', count: stats.completed },
    { name: 'قيد التنفيذ', count: stats.inProgress },
  ];

  return (
    <div className="min-h-screen font-cairo relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 p-4 md:p-6">
      {/* موجات خلفية زجاجية */}
     
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180 z-0">
        <svg className="relative block w-full h-32 md:h-48 text-indigo-100/60" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,100 C360,200 720,0 1080,100 C1260,160 1380,120 1440,100 L1440,0 L0,0 Z" fill="currentColor"/>
        </svg>
      </div>

      <div className="relative z-10 space-y-8">
        {/* العنوان */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-2">
            <span className="h-10 w-2 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded-full"></span>
            التقارير والإحصائيات
          </h1>
          <p className="text-gray-500 text-base mt-2 mr-3">نظرة عامة على أداء النظام وبيانات الطلبات</p>
        </div>

        {/* بطاقات الإحصائيات السريعة */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="إجمالي الطلبات" value={stats.total} icon={<FiLayers className="w-6 h-6" />} color="indigo" />
          <StatCard label="مكتملة" value={stats.completed} icon={<FiCheckCircle className="w-6 h-6" />} color="green" />
          <StatCard label="قيد التنفيذ" value={stats.inProgress} icon={<FiClock className="w-6 h-6" />} color="yellow" />
          <StatCard label="نسبة الإنجاز" value={`${stats.completionRate}%`} icon={<FiActivity className="w-6 h-6" />} color="purple" />
        </div>

        {/* الرسوم البيانية */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* بطاقة Pie Chart */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-indigo-100 rounded-xl"><FiPieChart className="text-indigo-600 w-5 h-5" /></div>
              <h3 className="text-xl font-bold text-gray-800">حالة الطلبات</h3>
            </div>
            <ResponsiveContainer width="100%" height={340}>
              <PieChart margin={{ top: 0, right: 0, bottom: 50, left: 0 }}>
                <Pie data={pieData} cx="50%" cy="45%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" label={null}>
                  {pieData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} stroke="white" strokeWidth={2} />)}
                </Pie>
                <Tooltip />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* بطاقة Bar Chart */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-indigo-100 rounded-xl"><FiBarChart2 className="text-indigo-600 w-5 h-5" /></div>
              <h3 className="text-xl font-bold text-gray-800">ملخص الأرقام</h3>
            </div>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={barData} barSize={45}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 14 }} />
                <YAxis tick={{ fill: '#475569', fontSize: 14 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[10,10,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* تحميل التقرير (للمشرف فقط) */}
        {user?.role === 'admin' && (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-indigo-100 rounded-xl"><FiPrinter className="text-indigo-600 w-5 h-5" /></div>
              <h3 className="text-xl font-bold text-gray-800">تحميل تقرير</h3>
            </div>
            <div className="flex flex-wrap items-end gap-5">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">نوع التقرير</label>
                <select value={reportType} onChange={e => setReportType(e.target.value)} className="border border-white/60 bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-3 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md">
                  <option value="monthly">شهري</option>
                  <option value="yearly">سنوي</option>
                </select>
              </div>
              {reportType === 'monthly' && (
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">الشهر</label>
                  <select value={month} onChange={e => setMonth(Number(e.target.value))} className="border border-white/60 bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-3 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md">
                    {Array.from({length:12}, (_,i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                  </select>
                </div>
              )}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">السنة</label>
                <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="border border-white/60 bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-3 text-gray-800 w-28 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md" />
              </div>
              <button 
                onClick={downloadReport} 
                disabled={loadingPdf} 
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-medium text-sm transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiDownload className="text-lg" />
                {loadingPdf ? 'جارٍ التحميل...' : 'حفظ / طباعة PDF'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  const bgGradient = {
    indigo: 'from-indigo-500 to-indigo-600',
    green: 'from-emerald-500 to-emerald-600',
    yellow: 'from-amber-400 to-amber-500',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-white/60 shadow-lg hover:shadow-xl transition-all">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${bgGradient[color]} text-white`}>
          {icon}
        </div>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}