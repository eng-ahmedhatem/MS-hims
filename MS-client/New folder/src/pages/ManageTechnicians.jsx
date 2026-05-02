import { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function ManageTechnicians() {
  const [technicians, setTechnicians] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    isActive: true
  });

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    try {
      const res = await axios.get('/api/users/technicians');
      setTechnicians(res.data);
    } catch (err) {
      console.error('فشل جلب الفنيين');
    }
  };

  const resetForm = () => {
    setForm({ username: '', password: '', fullName: '', email: '', isActive: true });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // تحديث فني موجود (بدون تغيير كلمة المرور إذا تركت فارغة)
        const updateData = {
          fullName: form.fullName,
          email: form.email,
          isActive: form.isActive
        };
        // إذا تم إدخال كلمة مرور جديدة نرسلها
        if (form.password) updateData.password = form.password;
        await axios.put(`/api/users/${editingId}`, updateData);
      } else {
        // إنشاء فني جديد
        await axios.post('/api/users', { ...form, role: 'technician' });
      }
      resetForm();
      fetchTechnicians();
    } catch (err) {
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  const handleEdit = (tech) => {
    setForm({
      username: tech.username,
      password: '', // لا نعرض كلمة المرور القديمة
      fullName: tech.fullName,
      email: tech.email || '',
      isActive: tech.isActive
    });
    setEditingId(tech._id);
    setShowForm(true);
  };

  const handleToggleActive = async (tech) => {
    try {
      await axios.put(`/api/users/${tech._id}`, { isActive: !tech.isActive });
      fetchTechnicians();
    } catch (err) {
      alert('فشل تحديث الحالة');
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">إدارة الفنيين</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-colors"
        >
          {showForm ? 'إلغاء' : 'إضافة فني جديد'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-gray-50">
          <h3 className="font-bold mb-3">{editingId ? 'تعديل بيانات الفني' : 'إضافة فني جديد'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="اسم المستخدم *"
              required={!editingId}
              disabled={!!editingId}
              className="p-2 border rounded"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
            />
            <input
              placeholder={editingId ? 'كلمة مرور جديدة (اختياري)' : 'كلمة المرور *'}
              type="password"
              required={!editingId}
              className="p-2 border rounded"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
            <input
              placeholder="الاسم الكامل *"
              required
              className="p-2 border rounded"
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
            />
            <input
              placeholder="البريد الإلكتروني"
              type="email"
              className="p-2 border rounded"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
            {editingId && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={e => setForm({ ...form, isActive: e.target.checked })}
                />
                نشط
              </label>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              {editingId ? 'حفظ التعديلات' : 'إضافة'}
            </button>
            <button type="button" onClick={resetForm} className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400">
              إلغاء
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-right">الاسم الكامل</th>
              <th className="p-2 text-right">اسم المستخدم</th>
              <th className="p-2 text-right">البريد الإلكتروني</th>
              <th className="p-2 text-right">الحالة</th>
              <th className="p-2 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {technicians.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">لا يوجد فنيين بعد</td>
              </tr>
            ) : (
              technicians.map(tech => (
                <tr key={tech._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{tech.fullName}</td>
                  <td className="p-2">{tech.username}</td>
                  <td className="p-2">{tech.email || '-'}</td>
                  <td className="p-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tech.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {tech.isActive ? 'نشط' : 'معطل'}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(tech)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleToggleActive(tech)}
                        className={tech.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}
                      >
                        {tech.isActive ? 'تعطيل' : 'تفعيل'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}