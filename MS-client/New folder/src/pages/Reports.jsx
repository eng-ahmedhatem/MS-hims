import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'; // تحتاج تثبيت recharts

export default function Reports() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    axios.get('/api/dashboard/stats').then(res => setStats(res.data));
  }, []);

  if (!stats) return <div>جاري التحميل...</div>;

  const data = [
    { name: 'مكتمل', value: stats.completed },
    { name: 'قيد التنفيذ', value: stats.inProgress },
    { name: 'جديد', value: stats.total - stats.completed - stats.inProgress }
  ];
  const COLORS = ['#10B981', '#F59E0B', '#3B82F6'];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">التقارير والإحصائيات</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex justify-center">
          <PieChart width={300} height={300}>
            <Pie data={data} cx="50%" cy="50%" outerRadius={100} label>
              {data.map((entry, index) => <Cell key={index} fill={COLORS[index]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <div>
          <p>نسبة الإنجاز: {stats.completionRate}%</p>
          <p>إجمالي الطلبات: {stats.total}</p>
          <p>مكتملة: {stats.completed}</p>
          <p>قيد التنفيذ: {stats.inProgress}</p>
        </div>
      </div>
    </div>
  );
}