import { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function ManageManagers() {
  const [managers, setManagers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', fullName: '', email: '', role: 'manager' });

  useEffect(() => { fetchManagers(); }, []);

  const fetchManagers = async () => {
    const res = await axios.get('/api/users/managers');
    setManagers(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/users', form);
    setShowForm(false);
    fetchManagers();
    setForm({ username: '', password: '', fullName: '', email: '', role: 'manager' });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">إدارة المديرين</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded">إضافة مدير جديد</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
          <input placeholder="اسم المستخدم" required className="w-full p-2 mb-2 border rounded" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
          <input placeholder="كلمة المرور" type="password" required className="w-full p-2 mb-2 border rounded" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          <input placeholder="الاسم الكامل" required className="w-full p-2 mb-2 border rounded" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
          <input placeholder="البريد الإلكتروني" className="w-full p-2 mb-4 border rounded" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">حفظ</button>
        </form>
      )}

      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2">الاسم الكامل</th>
            <th className="p-2">البريد الإلكتروني</th>
            <th className="p-2">الدور</th>
          </tr>
        </thead>
        <tbody>
          {managers.map(m => (
            <tr key={m._id} className="border-b">
              <td className="p-2">{m.fullName}</td>
              <td className="p-2">{m.email}</td>
              <td className="p-2">{m.role === 'admin' ? 'مدير النظام' : 'مدير'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}