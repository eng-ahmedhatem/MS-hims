import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function TicketsList() {
  const [tickets, setTickets] = useState([]);
  useEffect(() => { axios.get('/api/tickets').then(res => setTickets(res.data)); }, []);

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-indigo-50/30 min-h-screen font-cairo">
      <div className="mb-6 flex flex-wrap justify-between items-center gap-3 animate-fadeInDown">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 inline-block border-r-4 border-indigo-500 pr-3">
            جميع طلبات الصيانة
          </h2>
          <p className="text-gray-500 text-sm mt-2 mr-2">إدارة ومتابعة الطلبات</p>
        </div>
        <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm shadow-sm">
          إجمالي الطلبات: {tickets.length}
        </div>
      </div>

      {/* بطاقات للهواتف */}
      <div className="block md:hidden space-y-4">
        {tickets.map((ticket, idx) => (
          <div
            key={ticket._id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 p-4 animate-fadeInUp"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                #{ticket.ticketNumber}
              </span>
              <StatusBadge status={ticket.status} />
            </div>
            <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1">{ticket.title}</h3>
            <div className="flex flex-wrap gap-2 mb-3 text-sm">
              <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                {ticket.department}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                ticket.priority === 'عاجل' ? 'bg-red-100 text-red-700' :
                ticket.priority === 'متوسط' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
              }`}>
                {ticket.priority}
              </span>
            </div>
            <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
              <span className="text-gray-400 text-xs">طلب رقم: {ticket.ticketNumber}</span>
              <Link
                to={`/tickets/${ticket._id}`}
                className="text-indigo-600 hover:text-indigo-800 font-medium transition-all duration-200 hover:gap-1 inline-flex items-center gap-1 group"
              >
                عرض التفاصيل
                <ArrowLeftIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
        {tickets.length === 0 && (
          <div className="text-center py-10 bg-white rounded-xl shadow text-gray-400">
            لا توجد طلبات صيانة حالياً
          </div>
        )}
      </div>

      {/* جدول للأجهزة المتوسطة والكبيرة */}
      <div className="hidden md:block bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-indigo-50 to-blue-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-right font-semibold">#</th>
                <th className="px-4 py-3 text-right font-semibold">الموضوع</th>
                <th className="px-4 py-3 text-right font-semibold">القسم</th>
                <th className="px-4 py-3 text-right font-semibold">الأولوية</th>
                <th className="px-4 py-3 text-right font-semibold">الحالة</th>
                <th className="px-4 py-3 text-right font-semibold">التفاصيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tickets.map((ticket, idx) => (
                <tr
                  key={ticket._id}
                  className="hover:bg-indigo-50/40 transition-colors duration-200 group animate-fadeInUp"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    {ticket.ticketNumber}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 line-clamp-1">
                    {ticket.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full text-xs">
                      {ticket.department}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`
                      inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                      ${ticket.priority === 'عاجل' ? 'bg-red-100 text-red-700' : ''}
                      ${ticket.priority === 'متوسط' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${ticket.priority === 'عادي' ? 'bg-green-100 text-green-700' : ''}
                    `}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="transition-transform group-hover:scale-105">
                      <StatusBadge status={ticket.status} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {console.log(ticket)}
                    <Link
                      to={`/dashboard/tickets/${ticket._id}`}
                      className="relative inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium transition-all duration-200 group/link"
                    >
                      عرض
                      <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover/link:translate-x-1 rtl:group-hover/link:-translate-x-1" />
                      <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-indigo-400 transition-all group-hover/link:w-full"></span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tickets.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            لا توجد طلبات صيانة حالياً
          </div>
        )}
      </div>
    </div>
  );
}