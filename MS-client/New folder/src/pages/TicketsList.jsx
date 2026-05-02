import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import StatusBadge from '../components/StatusBadge';

export default function TicketsList() {
  const [tickets, setTickets] = useState([]);
  useEffect(() => { axios.get('/api/tickets').then(res => setTickets(res.data)); }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">جميع طلبات الصيانة</h2>
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2">الموضوع</th>
            <th className="p-2">القسم</th>
            <th className="p-2">الأولوية</th>
            <th className="p-2">الحالة</th>
            <th className="p-2">التفاصيل</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(t => (
            <tr key={t._id} className="border-b">
              <td className="p-2">{t.ticketNumber}</td>
              <td className="p-2">{t.title}</td>
              <td className="p-2">{t.department}</td>
              <td className="p-2"><span className={`px-2 py-1 rounded text-xs ${t.priority === 'عاجل' ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}>{t.priority}</span></td>
              <td className="p-2"><StatusBadge status={t.status} /></td>
              <td className="p-2"><Link to={`/tickets/${t._id}`} className="text-blue-600">عرض</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}