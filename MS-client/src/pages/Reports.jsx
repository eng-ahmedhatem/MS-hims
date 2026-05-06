import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { FiDownload, FiPieChart, FiBarChart2, FiPrinter } from 'react-icons/fi';

const COLORS = ['#0058be', '#2170e4', '#5b9bd5', '#a0c4e8', '#e8f0fe'];

// وسيلة الإيضاح المخصصة مع حساب النسبة المئوية
const CustomLegend = ({ payload }) => {
  if (!payload) return null;
  const total = payload.reduce((sum, entry) => sum + (entry.payload?.value || 0), 0);
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {payload.map((entry, index) => {
        const percent = total > 0 ? ((entry.payload?.value / total) * 100).toFixed(0) : 0;
        return (
          <div key={`item-${index}`} className="flex items-center gap-1 text-sm text-slate-700">
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span>
              {entry.value}: {percent}%
            </span>
          </div>
        );
      })}
    </div>
  );
};

// وسوم HTML للأولوية والحالة (تستخدم في التقرير الشهري)
function buildPriorityBadge(priority) {
  const map = {
    عالية:   'background:#FEE2E2;color:#B91C1C;',
    متوسطة:  'background:#FEF3C7;color:#92400E;',
    منخفضة:  'background:#F0FDF4;color:#166534;',
  };
  const style = map[priority] || 'background:#F1F5F9;color:#475569;';
  return `<span style="${style}border-radius:4px;padding:2px 7px;font-size:9px;font-weight:600;">${priority}</span>`;
}

function buildStatusBadge(status) {
  const map = {
    مكتمل:           'background:#DCFCE7;color:#15803D;',
    'قيد التنفيذ':   'background:#DBEAFE;color:#1D4ED8;',
    جديد:            'background:#FEF9C3;color:#854D0E;',
    ملغي:            'background:#FEE2E2;color:#B91C1C;',
    مراجعة:          'background:#F3E8FF;color:#6B21A8;',
  };
  const style = map[status] || 'background:#F1F5F9;color:#475569;';
  return `<span style="${style}border-radius:4px;padding:2px 7px;font-size:9px;font-weight:600;">${status}</span>`;
}

// صفوف جدول الطلبات
function buildTicketRows(tickets) {
  if (!tickets || tickets.length === 0) {
    return '<tr><td colspan="6" style="text-align:center;color:#94A3B8;padding:16px;">لا توجد طلبات هذا الشهر</td></tr>';
  }
  return tickets.map(t => {
    const assignedName = (t.assignedTo && t.assignedTo.fullName)
      ? t.assignedTo.fullName
      : '<span style="color:#94A3B8">غير محدد</span>';
    const department = t.department || 'غير محدد';
    return `
      <tr>
        <td style="font-weight:700;color:#0058be;">${t.ticketNumber}</td>
        <td style="text-align:right;padding-right:8px;">${t.title}</td>
        <td>${department}</td>
        <td>${buildPriorityBadge(t.priority || '')}</td>
        <td>${buildStatusBadge(t.status || '')}</td>
        <td>${assignedName}</td>
      </tr>
    `;
  }).join('');
}

// عروض توزيع الأقسام
function buildDeptPills(departments) {
  const entries = Object.entries(departments || {});
  if (entries.length === 0) {
    return '<span style="color:#94A3B8;font-size:9pt;">لا توجد بيانات</span>';
  }
  return entries.map(([dept, count]) => `
    <div class="dept-pill">
      <span class="dept-cnt">${count}</span>
      ${dept}
    </div>
  `).join('');
}

// بناء مستند HTML للتقرير الشهري
function buildReportHTML(report, year) {
  // حماية من بيانات ناقصة
  const summary = report?.summary || {};
  const total = summary.total ?? 0;
  const completed = summary.completed ?? 0;
  const inProgress = summary.inProgress ?? 0;
  const completionRate = parseFloat(summary.completionRate) || 0;
  const departments = summary.departments || {};
  const tickets = report?.tickets || [];

  const issueDate = new Date().toLocaleDateString('ar-EG');
  // حساب عدد أيام الشهر – إرسال الشهر كما هو (1-12) يعمل لأن Date تستخدم 0 للشهر السابق
  const daysInMonth = new Date(report.year, report.month, 0).getDate();
  const monthPad = String(report.month).padStart(2, '0');
  const period = `01/${monthPad} – ${daysInMonth}/${monthPad} / ${report.year}`;
  const ticketRows = buildTicketRows(tickets);
  const deptPills = buildDeptPills(departments);

  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>تقرير الصيانة - ${report.month}/${report.year}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Almarai:wght@400;700&display=swap');
    @page {
      size: 210mm 297mm portrait;
      margin: 10mm 8mm 14mm 8mm;
    }
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
      margin:0; padding:0; box-sizing:border-box;
    }
    html { width:100%; }
    body {
      font-family: 'Almarai', 'Segoe UI', Tahoma, Arial, sans-serif;
      direction: rtl;
      background: white;
      color: #1E293B;
      font-size: 11pt;
    }
    .pg-header {
      background:#0058be;
      padding:14px 22px;
      display:flex;
      align-items:center;
      justify-content:space-between;
    }
    .pg-header h1 { color:#fff; font-size:16pt; font-weight:700; }
    .pg-header h2 { color:#b3d4ff; font-size:10pt; font-weight:400; margin-top:3px; }
    .pg-header-icon {
      width:46px; height:46px;
      background:rgba(255,255,255,0.15);
      border-radius:10px;
      display:flex; align-items:center; justify-content:center;
    }
    .pg-meta {
      background:#F1F5F9;
      border-bottom:1.5px solid #CBD5E1;
      padding:7px 22px;
      display:flex;
      gap:24px;
      font-size:9pt;
      color:#475569;
    }
    .pg-meta b { color:#1E293B; }
    .pg-body { padding:14px 18px; }
    .s-card {
      border-radius:8px;
      padding:10px 8px;
      text-align:center;
    }
    .s-card.blue   { background:#EFF6FF; border:1.5px solid #BFDBFE; }
    .s-card.green  { background:#F0FDF4; border:1.5px solid #BBF7D0; }
    .s-card.orange { background:#FFF7ED; border:1.5px solid #FED7AA; }
    .s-card.purple { background:#F5F3FF; border:1.5px solid #DDD6FE; }
    .s-card .num { font-size:20pt; font-weight:700; }
    .s-card.blue   .num { color:#1D4ED8; }
    .s-card.green  .num { color:#16A34A; }
    .s-card.orange .num { color:#EA580C; }
    .s-card.purple .num { color:#7C3AED; }
    .s-card .lbl { font-size:8pt; color:#64748B; margin-top:2px; }
    .progress-wrap { margin-bottom:12px; }
    .progress-label {
      display:flex;
      justify-content:space-between;
      font-size:9pt;
      color:#475569;
      margin-bottom:4px;
    }
    .progress-bar {
      height:9px;
      background:#E2E8F0;
      border-radius:5px;
      overflow:hidden;
    }
    .progress-fill {
      height:100%;
      background:#0058be;
      border-radius:5px;
    }
    .section-title {
      font-size:10pt;
      font-weight:700;
      color:#0058be;
      border-right:3.5px solid #0058be;
      padding-right:8px;
      margin-bottom:8px;
      margin-top:12px;
    }
    table {
      width:100%;
      border-collapse:collapse;
      table-layout:fixed;
      margin-bottom:12px;
    }
    thead tr { background:#0058be; }
    thead th {
      color:white;
      padding:7px 5px;
      font-size:9pt;
      font-weight:700;
      text-align:center;
    }
    tbody tr:nth-child(even) td { background:#F8FAFC; }
    tbody td {
      padding:6px 5px;
      text-align:center;
      border-bottom:1px solid #E2E8F0;
      font-size:8.5pt;
      color:#334155;
      word-break:break-word;
    }
    tr { page-break-inside:avoid; }
    .dept-wrap {
      display:flex;
      flex-wrap:wrap;
      gap:6px;
      margin-top:6px;
    }
    .dept-pill {
      background:#EFF6FF;
      border:1px solid #BFDBFE;
      border-radius:6px;
      padding:5px 10px;
      font-size:9pt;
      color:#1D4ED8;
      display:inline-flex;
      align-items:center;
      gap:6px;
    }
    .dept-cnt {
      background:#0058be;
      color:white;
      border-radius:50%;
      width:18px;
      height:18px;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      font-size:8pt;
      font-weight:700;
    }
    .pg-footer {
      margin-top:16px;
      background:#F8FAFC;
      border-top:1.5px solid #E2E8F0;
      padding:7px 22px;
      display:flex;
      justify-content:space-between;
      font-size:8pt;
      color:#94A3B8;
    }
  </style>
</head>
<body>
  <div class="pg-header">
    <div>
      <h1>نظام إدارة الصيانة</h1>
      <h2>التقرير الشهري — ${report.month} / ${report.year}</h2>
    </div>
    <div class="pg-header-icon">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    </div>
  </div>

  <div class="pg-meta">
    <span>تاريخ الإصدار: <b>${issueDate}</b></span>
    <span>إجمالي الطلبات: <b>${total}</b></span>
    <span>الفترة: <b>${period}</b></span>
  </div>

  <div class="pg-body">
    <table style="border-spacing:8px;margin-bottom:12px;">
      <tr>
        <td class="s-card blue">
          <div class="num">${total}</div>
          <div class="lbl">إجمالي الطلبات</div>
        </td>
        <td class="s-card green">
          <div class="num">${completed}</div>
          <div class="lbl">مكتملة</div>
        </td>
        <td class="s-card orange">
          <div class="num">${inProgress}</div>
          <div class="lbl">قيد التنفيذ</div>
        </td>
        <td class="s-card purple">
          <div class="num">${completionRate}%</div>
          <div class="lbl">نسبة الإنجاز</div>
        </td>
      </tr>
    </table>

    <div class="progress-wrap">
      <div class="progress-label">
        <span>تقدم الإنجاز الكلي</span>
        <span>${completionRate}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${completionRate}%"></div>
      </div>
    </div>

    <div class="section-title">تفاصيل طلبات الصيانة</div>
    <table>
      <thead>
        <tr>
          <th style="width:13%">رقم الطلب</th>
          <th style="width:30%">الموضوع</th>
          <th style="width:15%">القسم</th>
          <th style="width:11%">الأولوية</th>
          <th style="width:13%">الحالة</th>
          <th style="width:18%">المسند إليه</th>
        </tr>
      </thead>
      <tbody>${ticketRows}</tbody>
    </table>

    <div class="section-title">توزيع الطلبات على الأقسام</div>
    <div class="dept-wrap">${deptPills}</div>
  </div>

  <div class="pg-footer">
    <span>تم الإنشاء تلقائياً بواسطة نظام إدارة الصيانة</span>
    <span>جميع الحقوق محفوظة © ${year}</span>
  </div>

  <script>window.onload=function(){setTimeout(function(){window.print();},400);};<\/script>
</body>
</html>`;
}

// ══════════════════════════════════════════
export default function Reports() {
  const { user } = useAuth();
  const [stats, setStats]           = useState(null);
  const [month, setMonth]           = useState(new Date().getMonth() + 1);
  const [year,  setYear]            = useState(new Date().getFullYear());
  const [loadingPdf, setLoadingPdf] = useState(false);

  useEffect(() => {
    axios.get('/api/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(() => console.error('فشل تحميل الإحصائيات'));
  }, []);

  const downloadMonthlyReport = async () => {
    setLoadingPdf(true);
    try {
      const res    = await axios.get(`/api/reports/monthly?month=${month}&year=${year}`);
      const report = res.data;
      if (!report) {
        throw new Error('بيانات التقرير فارغة');
      }

      const htmlContent = buildReportHTML(report, year);

      // تصحيح: استخدام '_blank' لفتح نافذة جديدة بشكل صحيح
      const printWindow = window.open('', '_blank', 'width=1500,height=1123');
      if (!printWindow) {
        alert('الرجاء السماح بالنوافذ المنبثقة لطباعة التقرير');
        return;
      }
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } catch (error) {
      console.error(error);
      alert('فشل تحميل بيانات التقرير.');
    } finally {
      setLoadingPdf(false);
    }
  };

  if (!stats) {
    return <div className="p-8 text-center text-slate-600">جاري تحميل الإحصائيات...</div>;
  }

  // معالجة قيمة محتملة سالبة في المكوّن الثالث
  const extraCount = Math.max(0, stats.total - stats.completed - stats.inProgress);
  const pieData = [
    { name: 'مكتمل',         value: stats.completed },
    { name: 'قيد التنفيذ',   value: stats.inProgress },
    { name: 'جديد / مراجعة', value: extraCount },
  ];

  const barData = [
    { name: 'الإجمالي',    count: stats.total },
    { name: 'مكتملة',      count: stats.completed },
    { name: 'قيد التنفيذ', count: stats.inProgress },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen font-almarai">
      <h1 className="text-3xl font-extrabold text-slate-800">التقارير والإحصائيات</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="إجمالي الطلبات" value={stats.total}                color="blue"   />
        <StatCard label="مكتملة"          value={stats.completed}            color="green"  />
        <StatCard label="قيد التنفيذ"     value={stats.inProgress}           color="orange" />
        <StatCard label="نسبة الإنجاز"    value={`${stats.completionRate ?? 0}%`} color="purple" />
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-blue-100 shadow-sm">
        <div className="flex justify-between text-sm text-slate-600 mb-2">
          <span>تقدم الإنجاز الكلي</span>
          <span>{stats.completionRate ?? 0}%</span>
        </div>
        <div className="w-full bg-blue-100 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-700 h-full rounded-full transition-all duration-700"
            style={{ width: `${stats.completionRate ?? 0}%` }}
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
                  cx="50%" cy="45%"
                  innerRadius={60} outerRadius={95}
                  paddingAngle={4} dataKey="value"
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
            <h3 className="text-lg font-bold text-slate-800">طباعة تقرير شهري</h3>
          </div>
          <div className="flex flex-wrap items-end gap-4">
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
              onClick={downloadMonthlyReport}
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
    blue:   'from-blue-500   to-blue-600   shadow-blue-100',
    green:  'from-green-500  to-green-600  shadow-green-100',
    orange: 'from-orange-400 to-orange-500 shadow-orange-100',
    purple: 'from-purple-500 to-purple-600 shadow-purple-100',
  };
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className={`bg-gradient-to-br ${gradients[color] || ''} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-2`}>
        <span className="font-bold">{value?.toString().charAt(0)}</span>
      </div>
      <p className="text-slate-500 text-sm">{label}</p>
      <p className="text-2xl font-extrabold text-slate-800">{value}</p>
    </div>
  );
}