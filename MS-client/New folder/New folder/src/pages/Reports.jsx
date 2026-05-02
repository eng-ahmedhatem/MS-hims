import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function Reports() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    axios.get('/api/dashboard/stats').then(res => setStats(res.data));
  }, []);

  if (!stats) {
    return <div className="text-center mt-10 font-cairo text-gray-600">جاري التحميل...</div>;
  }

  const data = [
    { name: 'مكتمل', value: stats.completed },
    { name: 'قيد التنفيذ', value: stats.inProgress },
    { name: 'جديد', value: stats.total - stats.completed - stats.inProgress }
  ];
  const COLORS = ['#10B981', '#F59E0B', '#3B82F6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 p-4 md:p-6 animate-fadeIn font-cairo">
      <div className="max-w-6xl mx-auto">
        {/* عنوان الصفحة */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 inline-block border-r-4 border-indigo-500 pr-3">
            التقارير والإحصائيات
          </h2>
          <p className="text-gray-500 text-sm mt-2 mr-2">
            ملخص أداء الطلبات ونسبة الإنجاز
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 md:p-8">
            {/* قسم الرسم البياني */}
            <div className="flex justify-center items-center bg-gray-50/50 rounded-xl p-4 transition-all hover:bg-gray-50">
              <div className="w-full max-w-sm mx-auto">
                <PieChart width={300} height={300}>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </div>

            {/* قسم الإحصائيات */}
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2 mb-4">
                <h3 className="text-lg font-bold text-gray-700">نظرة عامة</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* نسبة الإنجاز */}
                <div className="bg-gray-50 rounded-xl p-4 transition-all duration-200 hover:bg-indigo-50 hover:shadow-md hover:-translate-y-0.5">
                  <div className="text-sm text-gray-500 mb-1">نسبة الإنجاز</div>
                  <div className="text-3xl font-bold text-indigo-600">{stats.completionRate}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${stats.completionRate}%` }}
                    />
                  </div>
                </div>

                {/* إجمالي الطلبات */}
                <div className="bg-gray-50 rounded-xl p-4 transition-all duration-200 hover:bg-indigo-50 hover:shadow-md hover:-translate-y-0.5">
                  <div className="text-sm text-gray-500 mb-1">إجمالي الطلبات</div>
                  <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
                </div>

                {/* المكتملة */}
                <div className="bg-gray-50 rounded-xl p-4 transition-all duration-200 hover:bg-indigo-50 hover:shadow-md hover:-translate-y-0.5">
                  <div className="text-sm text-gray-500 mb-1">مكتملة</div>
                  <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
                </div>

                {/* قيد التنفيذ */}
                <div className="bg-gray-50 rounded-xl p-4 transition-all duration-200 hover:bg-indigo-50 hover:shadow-md hover:-translate-y-0.5">
                  <div className="text-sm text-gray-500 mb-1">قيد التنفيذ</div>
                  <div className="text-3xl font-bold text-amber-600">{stats.inProgress}</div>
                </div>
              </div>

              {/* معلومات إضافية عن التوزيع (بدون أي رموز) */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-600 mb-2">توزيع الطلبات حسب الفئات</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {data.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1 px-2 rounded hover:bg-gray-50 transition-colors">
                      <span className="text-gray-700">{item.name}</span>
                      <span className="font-mono text-gray-600">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}