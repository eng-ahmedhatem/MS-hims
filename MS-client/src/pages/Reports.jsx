import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { FiDownload, FiPieChart, FiBarChart2, FiPrinter, FiCalendar } from 'react-icons/fi';

const COLORS = ['#0058be', '#2170e4', '#5b9bd5', '#a0c4e8', '#e8f0fe'];

// وسيلة إيضاح مخصصة للمخطط الدائري (تظهر النسبة المئوية)
const CustomLegend = ({ payload }) => {
  if (!payload) return null;
  const total = payload.reduce((sum, entry) => sum + entry.payload.value, 0);
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center gap-1 text-sm text-slate-700">
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <span>
            {entry.value}: {((entry.payload.value / total) * 100).toFixed(0)}%
          </span>
        </div>
      ))}
    </div>
  );
};

export default function Reports() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [reportType, setReportType] = useState('monthly'); // monthly | yearly
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loadingPdf, setLoadingPdf] = useState(false);

  useEffect(() => {
    axios.get('/api/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(() => console.error('فشل تحميل الإحصائيات'));
  }, []);

  const downloadReport = async () => {
    setLoadingPdf(true);
    try {
      const endpoint = reportType === 'monthly'
        ? `/api/reports/monthly?month=${month}&year=${year}`
        : `/api/reports/yearly?year=${year}`;

      const res = await axios.get(endpoint);
      const report = res.data;
      const title = reportType === 'monthly'
        ? `التقرير الشهري - ${report.month}/${report.year}`
        : `التقرير السنوي - ${report.year}`;

      // --- دوال مساعدة لتنسيق التاريخ والمدة ---
      const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('ar-SA');
      };

      const formatDuration = (hours) => {
        if (hours == null || hours === 0) return '-';
        const totalHours = Number(hours);
        const days = Math.floor(totalHours / 24);
        const remainingHours = Math.round(totalHours % 24);
        if (days > 0) {
          return remainingHours > 0
            ? `${days} يوم و ${remainingHours} ساعة`
            : `${days} يوم`;
        }
        return `${remainingHours} ساعة`;
      };
      // -------------------------------------------

      // بناء جدول أداء الفنيين (بدون تغيير)
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
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Almarai:wght@400;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: A4; margin: 0; }
    body {
      font-family: 'Almarai', sans-serif;
      direction: rtl;
      background: white;
      color: #1E293B;
      width: 100%;
      max-width: 210mm;
      margin: 0 auto;
      padding: 8mm 6mm;
      font-size: 10pt;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #0058be;
      padding-bottom: 3mm;
      margin-bottom: 4mm;
    }
    .header h1 { color: #0058be; font-size: 18pt; margin-bottom: 1mm; }
    .header h2 { color: #475569; font-weight: 400; font-size: 12pt; }
    .meta {
      display: flex;
      justify-content: space-between;
      background: #F1F5F9;
      padding: 2mm 4mm;
      border-radius: 2mm;
      margin-bottom: 4mm;
      font-size: 9pt;
      border: 1px solid #CBD5E1;
    }
    table {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
      margin-bottom: 5mm;
      font-size: 7pt;
      word-break: break-all;
    }
    th, td {
      border: 1px solid #CBD5E1;
      padding: 3px 2px;
      text-align: center;
      vertical-align: middle;
      font-size: 7pt;
    }
    th {
      background-color: #0058be;
      color: white;
      font-weight: bold;
      font-size: 7pt;
    }
    tr:nth-child(even) td { background-color: #F8FAFC; }
    .summary-section {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 3mm;
      padding: 4mm;
      margin-bottom: 4mm;
      page-break-inside: avoid;
    }
    .stats-grid {
      display: flex;
      justify-content: space-around;
      gap: 2mm;
      margin-bottom: 3mm;
    }
    .stat-box {
      flex: 1;
      background: white;
      border-radius: 2mm;
      padding: 2mm;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .stat-box .number { font-size: 13pt; font-weight: 700; color: #0058be; }
    .stat-box .label { font-size: 7pt; color: #64748B; }
    .progress-bar { height: 4mm; background: #E2E8F0; border-radius: 2mm; overflow: hidden; margin: 2mm 0; }
    .progress-fill { height: 100%; background: linear-gradient(to left, #0058be, #2170e4); border-radius: 2mm; }
    .dept-list { display: flex; flex-wrap: wrap; gap: 2mm; margin-top: 2mm; font-size: 8pt; }
    .dept-item { background: white; border: 1px solid #CBD5E1; border-radius: 2mm; padding: 1mm 3mm; }
    .footer { margin-top: 6mm; text-align: center; font-size: 7pt; color: #94A3B8; border-top: 1px solid #CBD5E1; padding-top: 2mm; }
  </style>
</head>
<body>
  <div class="header">
    <h1>نظام إدارة الصيانة</h1>
    <h2>${title}</h2>
  </div>
  <div class="meta">
    <span>تاريخ الإصدار: ${new Date().toLocaleDateString('ar-SA')}</span>
    <span>عدد الطلبات: ${report.summary.total}</span>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:8%;">#</th>
        <th style="width:18%;">الموضوع</th>
        <th style="width:9%;">القسم</th>
        <th style="width:8%;">الأولوية</th>
        <th style="width:9%;">الحالة</th>
        <th style="width:10%;">المسند</th>
        <th style="width:10%;">تاريخ البداية</th>
        <th style="width:10%;">تاريخ الإنتهاء</th>
        <th style="width:18%;">المدة</th>
      </tr>
    </thead>
    <tbody>
      ${report.tickets.map(ticket => `
        <tr>
          <td>${ticket.ticketNumber}</td>
          <td>${ticket.title}</td>
          <td>${ticket.department}</td>
          <td>${ticket.priority}</td>
          <td>${ticket.status}</td>
          <td>${ticket.assignedTo?.fullName || 'غير محدد'}</td>
          <td>${formatDate(ticket.startDate)}</td>    <!-- تأكد من اسم الحقل في الـ API -->
          <td>${formatDate(ticket.endDate)}</td>      <!-- تأكد من اسم الحقل في الـ API -->
          <td>${formatDuration(ticket.durationHours)}</td>
        </tr>
      `).join('')}
      ${report.tickets.length === 0 ? '<tr><td colspan="9">لا توجد طلبات في هذه الفترة</td></tr>' : ''}
    </tbody>
  </table>

  <div class="summary-section">
    <div class="stats-grid">
      <div class="stat-box"><div class="number">${report.summary.completed}</div><div class="label">مكتملة</div></div>
      <div class="stat-box"><div class="number">${report.summary.inProgress}</div><div class="label">قيد التنفيذ</div></div>
      <div class="stat-box"><div class="number">${report.summary.cancelled}</div><div class="label">ملغاة</div></div>
      <div class="stat-box"><div class="number">${report.summary.pending}</div><div class="label">جديدة/مراجعة</div></div>
    </div>
    <div style="margin:3mm 0;">
      <span style="font-size:8pt;">نسبة الإنجاز: ${report.summary.completionRate}%</span>
      <div class="progress-bar"><div class="progress-fill" style="width:${report.summary.completionRate}%"></div></div>
    </div>
    <div style="font-weight:bold; font-size:9pt;">توزيع الأقسام:</div>
    <div class="dept-list">
      ${Object.entries(report.summary.departments).map(([dept, count]) => `
        <div class="dept-item">${dept}: ${count} طلب</div>
      `).join('')}
    </div>
  </div>

  ${techRows ? `
  <div class="summary-section">
    <div style="font-weight:bold; font-size:11pt; margin-bottom:3mm;">📋 أداء الفنيين</div>
    <table style="margin-bottom:0;">
      <thead>
        <tr>
          <th style="width:35%;">الفني</th>
          <th style="width:20%;">إجمالي الطلبات</th>
          <th style="width:20%;">الطلبات المنجزة</th>
          <th style="width:25%;">متوسط الوقت</th>
        </tr>
      </thead>
      <tbody>
        ${techRows}
      </tbody>
    </table>
  </div>` : ''}

  <div class="footer">
    تم إنشاء التقرير بواسطة نظام إدارة الصيانة - جميع الحقوق محفوظة © ${year}
  </div>
  <script>window.onload = () => window.print();</script>
</body>
</html>`;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } catch (error) {
      console.error(error);
      alert('فشل تحميل بيانات التقرير.');
    } finally {
      setLoadingPdf(false);
    }
  };

  if (!stats) return <div className="p-8 text-center text-slate-600">جاري تحميل الإحصائيات...</div>;

  const pieData = [
    { name: 'مكتمل', value: stats.completed },
    { name: 'قيد التنفيذ', value: stats.inProgress },
    { name: 'جديد / مراجعة', value: stats.total - stats.completed - stats.inProgress },
  ];

  const barData = [
    { name: 'الإجمالي', count: stats.total },
    { name: 'مكتملة', count: stats.completed },
    { name: 'قيد التنفيذ', count: stats.inProgress },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen font-almarai">
      <h1 className="text-3xl font-extrabold text-slate-800">التقارير والإحصائيات</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="إجمالي الطلبات" value={stats.total} color="blue" />
        <StatCard label="مكتملة" value={stats.completed} color="green" />
        <StatCard label="قيد التنفيذ" value={stats.inProgress} color="orange" />
        <StatCard label="نسبة الإنجاز" value={`${stats.completionRate}%`} color="purple" />
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-blue-100 shadow-sm">
        <div className="flex justify-between text-sm text-slate-600 mb-2">
          <span>تقدم الإنجاز الكلي</span>
          <span>{stats.completionRate}%</span>
        </div>
        <div className="w-full bg-blue-100 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-700 h-full rounded-full transition-all duration-700"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/85 backdrop-blur-md rounded-2xl p-6 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FiPieChart className="text-blue-600 text-xl" />
            <h3 className="text-lg font-bold text-slate-800">حالة الطلبات</h3>
          </div>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart margin={{ top: 0, right: 0, bottom: 50, left: 0 }}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  label={null}
                >
                  {pieData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} stroke="white" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [value, 'عدد الطلبات']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/85 backdrop-blur-md rounded-2xl p-6 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FiBarChart2 className="text-blue-600 text-xl" />
            <h3 className="text-lg font-bold text-slate-800">ملخص الأرقام</h3>
          </div>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={barData} barSize={45}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12 }} />
                <YAxis tick={{ fill: '#475569' }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {user?.role === 'admin' && (
        <div className="bg-white/85 backdrop-blur-md rounded-2xl p-6 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FiPrinter className="text-blue-600 text-xl" />
            <h3 className="text-lg font-bold text-slate-800">تحميل تقرير</h3>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-600 mb-1">نوع التقرير</label>
              <select
                value={reportType}
                onChange={e => setReportType(e.target.value)}
                className="border border-blue-200 rounded-xl px-3 py-2 text-slate-700 bg-white focus:ring-2 focus:ring-blue-300 outline-none"
              >
                <option value="monthly">شهري</option>
                <option value="yearly">سنوي</option>
              </select>
            </div>

            {reportType === 'monthly' && (
              <div className="flex flex-col">
                <label className="text-sm font-medium text-slate-600 mb-1">الشهر</label>
                <select
                  value={month}
                  onChange={e => setMonth(Number(e.target.value))}
                  className="border border-blue-200 rounded-xl px-3 py-2 text-slate-700 bg-white focus:ring-2 focus:ring-blue-300 outline-none"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-600 mb-1">السنة</label>
              <input
                type="number"
                value={year}
                onChange={e => setYear(Number(e.target.value))}
                className="border border-blue-200 rounded-xl px-3 py-2 text-slate-700 w-24 bg-white focus:ring-2 focus:ring-blue-300 outline-none"
              />
            </div>

            <button
              onClick={downloadReport}
              disabled={loadingPdf}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all disabled:opacity-50"
            >
              <FiDownload className="text-lg" />
              {loadingPdf ? 'جارٍ التحميل...' : 'حفظ / طباعة PDF'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  const gradients = {
    blue: 'from-blue-500 to-blue-600 shadow-blue-100',
    green: 'from-green-500 to-green-600 shadow-green-100',
    orange: 'from-orange-400 to-orange-500 shadow-orange-100',
    purple: 'from-purple-500 to-purple-600 shadow-purple-100',
  };
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className={`bg-gradient-to-br ${gradients[color]} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-2`}>
        <span className="font-bold">{value?.toString().charAt(0)}</span>
      </div>
      <p className="text-slate-500 text-sm">{label}</p>
      <p className="text-2xl font-extrabold text-slate-800">{value}</p>
    </div>
  );
}