const statusMap = {
  'جديد': 'bg-blue-100 text-blue-800',
  'قيد المراجعة': 'bg-yellow-100 text-yellow-800',
  'قيد التنفيذ': 'bg-orange-100 text-orange-800',
  'مكتمل': 'bg-green-100 text-green-800',
  'ملغي': 'bg-red-100 text-red-800'
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusMap[status]}`}>
      {status}
    </span>
  );
}