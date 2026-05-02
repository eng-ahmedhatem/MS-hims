import { useState } from 'react';
import { useNavigate }  from 'react-router-dom';
import axios from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import NeonLayout from '../components/NeonLayout';
import { MdArrowBack } from 'react-icons/md';

export default function TrackTicket() {
  const [ticketNumber, setTicketNumber] = useState('');
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    <NeonLayout>
      <div className="w-full max-w-xl relative">
        {/* زر الرجوع */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-0 right-0 md:-top-12 md:right-0 flex items-center gap-2 text-white/80 hover:text-white bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full transition-all duration-200 hover:bg-white/20 mb-4"
        >
          <MdArrowBack className="text-xl" />
          <span>رجوع</span>
        </button>

        <div className="bg-white/10 backdrop-blur-xl border border-[#2170e4]/30 rounded-2xl p-6 shadow-[0_0_25px_rgba(33,112,228,0.3)] mt-12 md:mt-0">
          <h2 className="text-2xl font-bold text-white mb-4">تتبع طلب</h2>
          <div className="flex gap-2 mb-4">
            <input value={ticketNumber} onChange={e => setTicketNumber(e.target.value)} 
                   placeholder="أدخل رقم التذكرة" className="flex-1 p-3 bg-white/5 border border-[#2170e4]/30 rounded-xl text-white" />
            <button onClick={handleTrack} className="px-6 bg-[#2170e4] text-white rounded-xl hover:bg-[#0058be]">بحث</button>
          </div>
          {error && <p className="text-red-300 mb-4">{error}</p>}
          {ticket && (
            <div className="bg-white/5 border border-[#2170e4]/30 rounded-xl p-4 text-white">
              <p><strong>رقم التذكرة:</strong> {ticket.ticketNumber}</p>
              <p><strong>المشكلة:</strong> {ticket.title}</p>
              <p><strong>الحالة:</strong> <StatusBadge status={ticket.status} /></p>
              <p><strong>مقدم الطلب:</strong> {ticket.createdBy?.name}</p>
              {ticket.assignedTo && <p><strong>مسند إلى:</strong> {ticket.assignedTo.fullName}</p>}
              {ticket.notes?.length > 0 && <p className="mt-2"><strong>آخر ملاحظة:</strong> {ticket.notes[ticket.notes.length-1].text}</p>}
            </div>
          )}
        </div>
      </div>
    </NeonLayout>
  );
}