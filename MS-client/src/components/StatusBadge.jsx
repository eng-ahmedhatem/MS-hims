// components/StatusBadge.jsx
const StatusBadge = ({ status }) => {
  const statusStyles = {
    'جديد': 'bg-blue-100 text-blue-700',
    'قيد المراجعة': 'bg-purple-100 text-purple-700',
    'قيد التنفيذ': 'bg-amber-100 text-amber-700',
    'مكتمل': 'bg-green-100 text-green-700',
    'ملغي': 'bg-gray-100 text-gray-700'
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      transition-all duration-200 hover:scale-105
      ${statusStyles[status] || 'bg-gray-100 text-gray-700'}
      font-cairo
    `}>
      {status}
    </span>
  );
};

export default StatusBadge;