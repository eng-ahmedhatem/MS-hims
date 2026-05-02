import { useState } from 'react';
import axios from '../api/axios';
import StatusBadge from '../components/StatusBadge';

export default function TrackTicket() {
  const [ticketNumber, setTicketNumber] = useState('');
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async () => {
    try {
      const res = await axios.get(`/api/tickets/track/${ticketNumber}`);
      setTicket(res.data);
      setError('');
    } catch (err) {
      setError('الطلب غير موجود');
      setTicket(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">تتبع طلب</h2>
      <div className="flex gap-2 mb-4">
        <input value={ticketNumber} onChange={e => setTicketNumber(e.target.value)} placeholder="أدخل رقم التذكرة (مثال: TIC-0001)" className="flex-1 p-2 border rounded" />
        <button onClick={handleTrack} className="bg-primary text-white px-4 rounded">بحث</button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {ticket && (
        <div className="border rounded p-4">
          <p><strong>رقم التذكرة:</strong> {ticket.ticketNumber}</p>
          <p><strong>المشكلة:</strong> {ticket.title}</p>
          <p><strong>الحالة:</strong> <StatusBadge status={ticket.status} /></p>
          <p><strong>مقدم الطلب:</strong> {ticket.createdBy?.name}</p>
          {ticket.assignedTo && <p><strong>مسند إلى:</strong> {ticket.assignedTo.fullName}</p>}
          {ticket.notes?.length > 0 && (
            <div className="mt-2">
              <strong>آخر ملاحظة:</strong> {ticket.notes[ticket.notes.length-1].text}
            </div>
          )}
        </div>
      )}
    </div>
  );
}