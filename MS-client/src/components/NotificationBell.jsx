import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { FiBell } from 'react-icons/fi';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const bellRef = useRef(null);
  const dropdownRef = useRef(null);

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get('/api/notifications/unread-count');
      setUnreadCount(res.data.count);
    } catch {}
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications');
      setNotifications(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current?.contains(e.target) ||
        bellRef.current?.contains(e.target)
      ) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleToggle = () => {
    if (bellRef.current) {
      const rect = bellRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX - 288 + rect.width,
      });
    }
    setOpen((v) => !v);
  };

  const handleMarkAllRead = async () => {
    await axios.put('/api/notifications/read-all');
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      await axios.put(`/api/notifications/${notif._id}/read`);
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    }
    setOpen(false);
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const diffMins = Math.floor((Date.now() - d) / 60000);
    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    return d.toLocaleDateString('ar-SA');
  };

  const dropdown = (
    <div
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: pos.top,
        left: "75%",
        width: 320,
        zIndex: 999999,
      }}
      className="bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-hidden flex flex-col"
    >
      <div className="flex justify-between items-center p-3 border-b border-gray-100">
        <h3 className="font-bold text-gray-800">الإشعارات</h3>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="text-xs text-indigo-600 hover:underline">
            تعيين الكل كمقروء
          </button>
        )}
      </div>
      <div className="overflow-y-auto divide-y divide-gray-100">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-sm">لا توجد إشعارات</div>
        ) : (
          notifications.map((notif) => (
            <Link
              key={notif._id}
              to={`/dashboard/tickets/${notif.ticket?._id}`}
              onClick={() => handleNotificationClick(notif)}
              className={`block p-3 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-indigo-50/60' : ''}`}
            >
              <div className="flex justify-between items-start gap-2">
                <p className="text-sm font-medium text-gray-800 leading-snug">{notif.message}</p>
                {!notif.read && <span className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />}
              </div>
              <p className="text-xs text-gray-400 mt-1">{formatTime(notif.createdAt)}</p>
              {notif.ticket && (
                <p className="text-xs text-indigo-500 mt-0.5">#{notif.ticket.ticketNumber}</p>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={bellRef}
        onClick={handleToggle}
        className="relative p-2 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none"
        title="الإشعارات"
      >
        <FiBell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Portal — يرسم الـ dropdown مباشرة في body بعيداً عن أي overflow */}
      {open && createPortal(dropdown, document.body)}
    </>
  );
}