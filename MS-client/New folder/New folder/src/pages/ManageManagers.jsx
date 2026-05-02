import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { PencilIcon, TrashIcon, CheckCircleIcon, XCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ManageManagers() {
  const [managers, setManagers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    role: 'manager',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      const res = await axios.get('/api/users/managers');
      setManagers(res.data);
    } catch (err) {
      showMessage('فشل تحميل المديرين', 'error');
    }
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const resetForm = () => {
    setForm({
      username: '',
      password: '',
      fullName: '',
      email: '',
      role: 'manager',
      isActive: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        const updateData = {
          fullName: form.fullName,
          email: form.email,
          role: form.role,
          isActive: form.isActive
        };
        if (form.password) updateData.password = form.password;
        await axios.put(`/api/users/${editingId}`, updateData);
        showMessage('تم تحديث المدير بنجاح', 'success');
      } else {
        await axios.post('/api/users', { ...form, role: form.role });
        showMessage('تم إضافة المدير بنجاح', 'success');
      }
      resetForm();
      fetchManagers();
    } catch (err) {
      showMessage(err.response?.data?.message || 'حدث خطأ أثناء الحفظ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (manager) => {
    setForm({
      username: manager.username,
      password: '',
      fullName: manager.fullName,
      email: manager.email || '',
      role: manager.role,
      isActive: manager.isActive
    });
    setEditingId(manager._id);
    setShowForm(true);
  };

  const handleDelete = async (id, fullName) => {
    if (!window.confirm(`هل أنت متأكد من حذف المدير "${fullName}"؟`)) return;
    try {
      await axios.delete(`/api/users/${id}`);
      showMessage('تم حذف المدير بنجاح', 'success');
      fetchManagers();
    } catch (err) {
      showMessage('فشل حذف المدير', 'error');
    }
  };

  const handleToggleActive = async (manager) => {
    try {
      await axios.put(`/api/users/${manager._id}`, { isActive: !manager.isActive });
      showMessage(`تم ${manager.isActive ? 'تعطيل' : 'تفعيل'} المدير بنجاح`, 'success');
      fetchManagers();
    } catch (err) {
      showMessage('فشل تحديث الحالة', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 p-4 md:p-6 animate-fadeIn font-cairo">
      <div className="max-w-6xl mx-auto">
        {/* زر الرجوع */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-indigo-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full transition-all duration-200 hover:bg-white"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>رجوع</span>
        </button>

        {/* الرأس */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 inline-block border-r-4 border-indigo-500 pr-3">
              إدارة المديرين
            </h2>
            <p className="text-gray-500 text-sm mt-2 mr-2">
              إضافة وتعديل المديرين وصلاحياتهم
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
          >
            {showForm ? 'إلغاء' : 'إضافة مدير جديد'}
          </button>
        </div>

        {/* رسالة الحالة */}
        {message.text && (
          <div className={`mb-4 p-3 rounded-xl text-sm text-center ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* نموذج الإضافة / التعديل */}
        {showForm && (
          <div className="mb-8 animate-fadeIn">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-l from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-800 text-lg">
                  {editingId ? 'تعديل بيانات المدير' : 'إضافة مدير جديد'}
                </h3>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* اسم المستخدم (غير قابل للتعديل) */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      اسم المستخدم {!editingId && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      placeholder="أدخل اسم المستخدم"
                      required={!editingId}
                      disabled={!!editingId}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                      value={form.username}
                      onChange={e => setForm({ ...form, username: e.target.value })}
                    />
                  </div>

                  {/* كلمة المرور */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {editingId ? 'كلمة مرور جديدة (اختياري)' : 'كلمة المرور *'}
                    </label>
                    <input
                      type="password"
                      placeholder={editingId ? 'اتركها فارغة إذا لم ترد التغيير' : 'أدخل كلمة المرور'}
                      required={!editingId}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                    />
                  </div>

                  {/* الاسم الكامل */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">الاسم الكامل <span className="text-red-500">*</span></label>
                    <input
                      placeholder="مثال: أحمد محمود"
                      required
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={form.fullName}
                      onChange={e => setForm({ ...form, fullName: e.target.value })}
                    />
                  </div>

                  {/* البريد الإلكتروني */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                    <input
                      type="email"
                      placeholder="example@domain.com"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  {/* الدور (صلاحية) */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">الدور / الصلاحية</label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={form.role}
                      onChange={e => setForm({ ...form, role: e.target.value })}
                    >
                      <option value="admin">مدير النظام (Admin)</option>
                      <option value="manager">مدير عادي (Manager)</option>
                    </select>
                  </div>

                  {/* الحالة (نشط / معطل) - للمستخدمين الحاليين فقط */}
                  {editingId && (
                    <div className="flex items-center gap-3 pt-6">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={form.isActive}
                        onChange={e => setForm({ ...form, isActive: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <label htmlFor="isActive" className="text-sm text-gray-700">نشط (يمكنه تسجيل الدخول)</label>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? 'جاري الحفظ...' : (editingId ? 'حفظ التعديلات' : 'إضافة المدير')}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2.5 rounded-xl"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* جدول المديرين (للشاشات الكبيرة) */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-indigo-50 to-blue-50 text-gray-700">
                <tr>
                  <th className="px-5 py-3 text-right font-semibold">الاسم الكامل</th>
                  <th className="px-5 py-3 text-right font-semibold">اسم المستخدم</th>
                  <th className="px-5 py-3 text-right font-semibold">البريد الإلكتروني</th>
                  <th className="px-5 py-3 text-right font-semibold">الدور</th>
                  <th className="px-5 py-3 text-right font-semibold">الحالة</th>
                  <th className="px-5 py-3 text-right font-semibold">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {managers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-400">لا يوجد مديرين حالياً</td>
                  </tr>
                ) : (
                  managers.map((manager, idx) => (
                    <tr key={manager._id} className="hover:bg-indigo-50/30 transition-colors duration-150 animate-fadeIn" style={{ animationDelay: `${idx * 50}ms` }}>
                      <td className="px-5 py-3 font-medium text-gray-800">{manager.fullName}</td>
                      <td className="px-5 py-3 text-gray-600 font-mono text-xs">{manager.username}</td>
                      <td className="px-5 py-3 text-gray-500">{manager.email || '-'}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          manager.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {manager.role === 'admin' ? 'مدير نظام' : 'مدير'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          manager.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {manager.isActive ? 'نشط' : 'معطل'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleEdit(manager)} className="text-indigo-600 hover:text-indigo-800" title="تعديل">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleToggleActive(manager)} className={`${manager.isActive ? 'text-amber-600 hover:text-amber-800' : 'text-green-600 hover:text-green-800'}`} title={manager.isActive ? 'تعطيل' : 'تفعيل'}>
                            {manager.isActive ? <XCircleIcon className="w-4 h-4" /> : <CheckCircleIcon className="w-4 h-4" />}
                          </button>
                          <button onClick={() => handleDelete(manager._id, manager.fullName)} className="text-red-600 hover:text-red-800" title="حذف">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* بطاقات للهواتف */}
          <div className="block md:hidden divide-y divide-gray-100">
            {managers.length === 0 ? (
              <div className="text-center py-10 text-gray-400">لا يوجد مديرين حالياً</div>
            ) : (
              managers.map((manager, idx) => (
                <div key={manager._id} className="p-4 hover:bg-indigo-50/30 transition-all duration-200">
                  <div className="font-bold text-gray-800 text-base">{manager.fullName}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    <span className="font-medium">اسم المستخدم:</span> {manager.username}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">البريد:</span> {manager.email || 'غير متوفر'}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      manager.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {manager.role === 'admin' ? 'مدير نظام' : 'مدير'}
                    </span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      manager.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {manager.isActive ? 'نشط' : 'معطل'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 pt-2 border-t border-gray-100">
                    <button onClick={() => handleEdit(manager)} className="text-indigo-600 text-sm">تعديل</button>
                    <button onClick={() => handleToggleActive(manager)} className={`text-sm ${manager.isActive ? 'text-amber-600' : 'text-green-600'}`}>
                      {manager.isActive ? 'تعطيل' : 'تفعيل'}
                    </button>
                    <button onClick={() => handleDelete(manager._id, manager.fullName)} className="text-red-600 text-sm">حذف</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}