import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [institution, setInstitution] = useState('');

  useEffect(() => {
    axios.get('/api/dashboard/stats').then(res => setStats(res.data));
    axios.get('/api/settings').then(res => setInstitution(res.data.institutionName));
  }, []);

  if (!stats) return <div className="text-center mt-10">جاري التحميل...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">مرحباً بك في {institution || 'النظام'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow"><p className="text-gray-500">إجمالي الطلبات</p><p className="text-3xl font-bold">{stats.total}</p></div>
        <div className="bg-white p-4 rounded shadow"><p className="text-gray-500">مكتملة</p><p className="text-3xl font-bold">{stats.completed}</p></div>
        <div className="bg-white p-4 rounded shadow"><p className="text-gray-500">قيد التنفيذ</p><p className="text-3xl font-bold">{stats.inProgress}</p></div>
        <div className="bg-white p-4 rounded shadow"><p className="text-gray-500">نسبة الإنجاز</p><p className="text-3xl font-bold">{stats.completionRate}%</p></div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-bold mb-4">أحدث الطلبات</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-right">رقم التذكرة</th>
                <th className="p-2 text-right">المشكلة</th>
                <th className="p-2 text-right">الحالة</th>
                <th className="p-2 text-right">التاريخ</th>
                <th className="p-2 text-right">الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.map(ticket => (
                <tr key={ticket._id} className="border-b">
                  <td className="p-2">{ticket.ticketNumber}</td>
                  <td className="p-2">{ticket.title}</td>
                  <td className="p-2"><StatusBadge status={ticket.status} /></td>
                  <td className="p-2">{new Date(ticket.createdAt).toLocaleDateString('ar-SA')}</td>
                  <td className="p-2"><Link to={`/tickets/${ticket._id}`} className="text-blue-600">عرض</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}