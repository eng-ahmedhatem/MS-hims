import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { MdDeleteForever } from 'react-icons/md'; // أيقونة الحذف

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
  const [deletingId, setDeletingId] = useState(null); // لتتبع عملية الحذف

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
        const updateData = {
          fullName: form.fullName,
          email: form.email,
          isActive: form.isActive
        };
        if (form.password) updateData.password = form.password;
        await axios.put(`/api/users/${editingId}`, updateData);
      } else {
        await axios.post('/api/users', { ...form, role: 'technician' });
      }
      resetForm();
      fetchTechnicians();
      alert(editingId ? 'تم تحديث الفني بنجاح' : 'تم إضافة الفني بنجاح');
    } catch (err) {
      alert(err.response?.data?.message || 'حدث خطأ أثناء الحفظ');
    }
  };

  const handleEdit = (tech) => {
    setForm({
      username: tech.username,
      password: '',
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

  // 🆕 دالة الحذف
  const handleDelete = async (tech) => {
    if (!window.confirm(`هل أنت متأكد من حذف الفني "${tech.fullName}" نهائياً؟`)) return;

    setDeletingId(tech._id);
    try {
      await axios.delete(`/api/users/${tech._id}`);
      fetchTechnicians();
      alert('تم حذف الفني بنجاح');
    } catch (err) {
      alert(err.response?.data?.message || 'فشل حذف الفني');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 p-4 md:p-6 animate-fadeIn font-cairo">
      <div className="max-w-6xl mx-auto">
        {/* رأس الصفحة مع زر الإضافة */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 inline-block border-r-4 border-indigo-500 pr-3">
              إدارة الفنيين
            </h2>
            <p className="text-gray-500 text-sm mt-2 mr-2">
              إضافة وتعديل وإدارة حسابات الفنيين
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {showForm ? 'إلغاء' : 'إضافة فني جديد'}
          </button>
        </div>

        {/* نموذج الإضافة / التعديل */}
        {showForm && (
          <div className="mb-8 animate-fadeIn">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-l from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-800 text-lg">
                  {editingId ? 'تعديل بيانات الفني' : 'إضافة فني جديد'}
                </h3>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* اسم المستخدم */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      اسم المستخدم {!editingId && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      placeholder="أدخل اسم المستخدم"
                      required={!editingId}
                      disabled={!!editingId}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-indigo-300 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                      value={form.username}
                      onChange={e => setForm({ ...form, username: e.target.value })}
                    />
                    {editingId && (
                      <p className="text-xs text-gray-400">لا يمكن تغيير اسم المستخدم أثناء التعديل</p>
                    )}
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
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-indigo-300"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                    />
                  </div>

                  {/* الاسم الكامل */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      الاسم الكامل <span className="text-red-500">*</span>
                    </label>
                    <input
                      placeholder="مثال: أحمد محمود"
                      required
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-indigo-300"
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
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-indigo-300"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                {editingId && (
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={form.isActive}
                      onChange={e => setForm({ ...form, isActive: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="isActive" className="text-sm text-gray-700">نشط (يمكنه استلام التذاكر)</label>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm hover:shadow transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    {editingId ? 'حفظ التعديلات' : 'إضافة الفني'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2.5 rounded-xl transition-all duration-200"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* عرض الفنيين - بطاقات للهواتف وجدول للشاشات الكبيرة */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
          {/* الجدول للشاشات المتوسطة والكبيرة */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-indigo-50 to-blue-50 text-gray-700">
                <tr>
                  <th className="px-5 py-3 text-right font-semibold">الاسم الكامل</th>
                  <th className="px-5 py-3 text-right font-semibold">اسم المستخدم</th>
                  <th className="px-5 py-3 text-right font-semibold">البريد الإلكتروني</th>
                  <th className="px-5 py-3 text-right font-semibold">الحالة</th>
                  <th className="px-5 py-3 text-right font-semibold">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {technicians.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-400">لا يوجد فنيين حالياً</td>
                  </tr>
                ) : (
                  technicians.map((tech, idx) => (
                    <tr key={tech._id} className="hover:bg-indigo-50/30 transition-colors duration-150 group animate-fadeIn" style={{ animationDelay: `${idx * 50}ms` }}>
                      <td className="px-5 py-3 font-medium text-gray-800">{tech.fullName}</td>
                      <td className="px-5 py-3 text-gray-600 font-mono text-xs">{tech.username}</td>
                      <td className="px-5 py-3 text-gray-500">{tech.email || '-'}</td>
                      <td className="px-5 py-3">
                        <span className={`
                          inline-block px-3 py-1 rounded-full text-xs font-medium
                          ${tech.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                        `}>
                          {tech.isActive ? 'نشط' : 'معطل'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-3 items-center">
                          <button
                            onClick={() => handleEdit(tech)}
                            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleToggleActive(tech)}
                            className={`font-medium transition-colors ${
                              tech.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                            }`}
                          >
                            {tech.isActive ? 'تعطيل' : 'تفعيل'}
                          </button>
                          {/* زر الحذف الجديد */}
                          <button
                            onClick={() => handleDelete(tech)}
                            disabled={deletingId === tech._id}
                            className="text-red-500 hover:text-red-700 font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                            title="حذف الفني"
                          >
                            <MdDeleteForever className="text-lg" />
                            <span>{deletingId === tech._id ? 'جاري...' : 'حذف'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* عرض بطاقات للهواتف */}
          <div className="block md:hidden divide-y divide-gray-100">
            {technicians.length === 0 ? (
              <div className="text-center py-10 text-gray-400">لا يوجد فنيين حالياً</div>
            ) : (
              technicians.map((tech, idx) => (
                <div key={tech._id} className="p-4 hover:bg-indigo-50/30 transition-all duration-200 animate-fadeIn" style={{ animationDelay: `${idx * 50}ms` }}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-gray-800 text-base">{tech.fullName}</div>
                    <span className={`
                      inline-block px-2 py-0.5 rounded-full text-xs font-medium
                      ${tech.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                    `}>
                      {tech.isActive ? 'نشط' : 'معطل'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-1">
                    <span className="font-medium text-gray-600">اسم المستخدم:</span> {tech.username}
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    <span className="font-medium text-gray-600">البريد:</span> {tech.email || 'غير متوفر'}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(tech)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleToggleActive(tech)}
                      className={`text-sm font-medium transition-colors ${
                        tech.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                      }`}
                    >
                      {tech.isActive ? 'تعطيل' : 'تفعيل'}
                    </button>
                    <button
                      onClick={() => handleDelete(tech)}
                      disabled={deletingId === tech._id}
                      className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                      <MdDeleteForever className="text-base" />
                      {deletingId === tech._id ? 'جاري...' : 'حذف'}
                    </button>
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