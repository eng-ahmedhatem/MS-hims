import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import {
  FiUser, FiLock, FiUserCheck, FiMail, FiShield,
  FiToggleLeft, FiEdit2, FiTrash2, FiArrowRight,
  FiPlus, FiX, FiCheck, FiAlertCircle, FiActivity ,FiChevronDown   
} from 'react-icons/fi';

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
    <div className="min-h-screen font-cairo relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 p-4 md:p-6">
      {/* موجات خلفية زجاجية */}

      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180 z-0">
        <svg className="relative block w-full h-32 md:h-48 text-indigo-100/60" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,100 C360,200 720,0 1080,100 C1260,160 1380,120 1440,100 L1440,0 L0,0 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-6">


        {/* الرأس */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-2">
              <span className="h-10 w-2 bg-gradient-to-b from-indigo-600 to-indigo-400 rounded-full"></span>
              إدارة المديرين
            </h1>
            <p className="text-gray-500 text-base mt-2 mr-3">
              إضافة وتعديل المديرين وصلاحياتهم
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-3 rounded-2xl shadow-md transition-all text-sm"
          >
            {showForm ? <FiX className="w-5 h-5" /> : <FiPlus className="w-5 h-5" />}
            {showForm ? 'إلغاء' : 'إضافة مدير جديد'}
          </button>
        </div>

        {/* رسالة الحالة */}
        {message.text && (
          <div className={`p-4 rounded-2xl text-sm font-medium flex items-center gap-2 ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' ? <FiCheck className="w-5 h-5" /> : <FiAlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        {/* نموذج الإضافة / التعديل */}
        {showForm && (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-6 md:p-8 animate-fadeInUp">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FiUserCheck className="w-5 h-5 text-indigo-500" />
              {editingId ? 'تعديل بيانات المدير' : 'إضافة مدير جديد'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* اسم المستخدم */}
                <div>
                  <label className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-2">
                    <FiUser className="w-4 h-4 text-indigo-500" />
                    اسم المستخدم {!editingId && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    placeholder="أدخل اسم المستخدم"
                    required={!editingId}
                    disabled={!!editingId}
                    className="w-full p-3.5 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md transition-all disabled:bg-gray-100"
                    value={form.username}
                    onChange={e => setForm({ ...form, username: e.target.value })}
                  />
                </div>

                {/* كلمة المرور */}
                <div>
                  <label className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-2">
                    <FiLock className="w-4 h-4 text-indigo-500" />
                    {editingId ? 'كلمة مرور جديدة (اختياري)' : 'كلمة المرور *'}
                  </label>
                  <input
                    type="password"
                    placeholder={editingId ? 'اتركها فارغة إذا لم ترد التغيير' : 'أدخل كلمة المرور'}
                    required={!editingId}
                    className="w-full p-3.5 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md transition-all"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                  />
                </div>

                {/* الاسم الكامل */}
                <div>
                  <label className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-2">
                    <FiUserCheck className="w-4 h-4 text-indigo-500" />
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    placeholder="مثال: أحمد محمود"
                    required
                    className="w-full p-3.5 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md transition-all"
                    value={form.fullName}
                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                  />
                </div>

                {/* البريد الإلكتروني */}
                <div>
                  <label className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-2">
                    <FiMail className="w-4 h-4 text-indigo-500" />
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    placeholder="example@domain.com"
                    className="w-full p-3.5 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl text-gray-800 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md transition-all"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                {/* الدور (صلاحية) */}
                <div>
                  <label className="flex items-center gap-1.5 text-base font-medium text-gray-700 mb-2">
                    <FiShield className="w-4 h-4 text-indigo-500" />
                    الدور / الصلاحية
                  </label>
                  <div className="relative">
                    <select
                      className="w-full p-3.5 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md appearance-none cursor-pointer transition-all"
                      value={form.role}
                      onChange={e => setForm({ ...form, role: e.target.value })}
                    >
                      <option value="admin">مدير النظام (Admin)</option>
                      <option value="manager">مدير عادي (Manager)</option>
                    </select>
                    <FiChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                  </div>
                </div>

                {/* الحالة (نشط / معطل) - للمستخدمين الحاليين فقط */}
                {editingId && (
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={form.isActive}
                      onChange={e => setForm({ ...form, isActive: e.target.checked })}
                      className="w-5 h-5 text-indigo-600 rounded-xl focus:ring-indigo-500"
                    />
                    <label htmlFor="isActive" className="text-base text-gray-700 flex items-center gap-1.5 cursor-pointer">
                      <FiActivity className="w-4 h-4 text-indigo-500" />
                      نشط (يمكنه تسجيل الدخول)
                    </label>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200/50">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-2xl shadow-md transition-all text-sm disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-5 h-5" />
                      {editingId ? 'حفظ التعديلات' : 'إضافة المدير'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-3 rounded-2xl transition-all text-sm"
                >
                  <FiX className="w-5 h-5" />
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {/* قائمة المديرين */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
          {/* عرض الجدول للشاشات الكبيرة */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-indigo-50/80 to-blue-50/80 text-gray-700 border-b border-white/60">
                <tr>
                  <th className="px-5 py-4 text-right font-semibold">الاسم الكامل</th>
                  <th className="px-5 py-4 text-right font-semibold">اسم المستخدم</th>
                  <th className="px-5 py-4 text-right font-semibold">البريد الإلكتروني</th>
                  <th className="px-5 py-4 text-right font-semibold">الدور</th>
                  <th className="px-5 py-4 text-right font-semibold">الحالة</th>
                  <th className="px-5 py-4 text-right font-semibold">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {managers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-400">لا يوجد مديرين حالياً</td>
                  </tr>
                ) : (
                  managers.map((manager, idx) => (
                    <tr key={manager._id} className="hover:bg-white/40 transition-all animate-fadeInUp" style={{ animationDelay: `${idx * 50}ms` }}>
                      <td className="px-5 py-4 font-medium text-gray-800">{manager.fullName}</td>
                      <td className="px-5 py-4 text-gray-600 font-mono text-xs">{manager.username}</td>
                      <td className="px-5 py-4 text-gray-500">{manager.email || '-'}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          manager.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {manager.role === 'admin' ? 'مدير نظام' : 'مدير'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          manager.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {manager.isActive ? 'نشط' : 'معطل'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleEdit(manager)} className="text-indigo-600 hover:text-indigo-800 p-1.5 rounded-full hover:bg-indigo-50 transition-colors" title="تعديل">
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleToggleActive(manager)} className={`p-1.5 rounded-full hover:bg-gray-50 transition-colors ${manager.isActive ? 'text-amber-600 hover:text-amber-800' : 'text-green-600 hover:text-green-800'}`} title={manager.isActive ? 'تعطيل' : 'تفعيل'}>
                            <FiToggleLeft className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(manager._id, manager.fullName)} className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 transition-colors" title="حذف">
                            <FiTrash2 className="w-4 h-4" />
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
          <div className="block md:hidden divide-y divide-gray-100/50">
            {managers.length === 0 ? (
              <div className="text-center py-10 text-gray-400">لا يوجد مديرين حالياً</div>
            ) : (
              managers.map((manager, idx) => (
                <div key={manager._id} className="p-4 hover:bg-white/40 transition-all duration-200 animate-fadeInUp" style={{ animationDelay: `${idx * 50}ms` }}>
                  <div className="font-bold text-gray-800 text-lg">{manager.fullName}</div>
                  <div className="text-sm text-gray-500 mt-1 space-y-0.5">
                    <p><span className="font-medium">اسم المستخدم:</span> {manager.username}</p>
                    <p><span className="font-medium">البريد:</span> {manager.email || 'غير متوفر'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-medium ${
                      manager.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {manager.role === 'admin' ? 'مدير نظام' : 'مدير'}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-medium ${
                      manager.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {manager.isActive ? 'نشط' : 'معطل'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-200/50 text-sm">
                    <button onClick={() => handleEdit(manager)} className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"><FiEdit2 className="w-4 h-4" /> تعديل</button>
                    <button onClick={() => handleToggleActive(manager)} className={`flex items-center gap-1 ${manager.isActive ? 'text-amber-600' : 'text-green-600'}`}>
                      <FiToggleLeft className="w-4 h-4" /> {manager.isActive ? 'تعطيل' : 'تفعيل'}
                    </button>
                    <button onClick={() => handleDelete(manager._id, manager.fullName)} className="text-red-500 hover:text-red-700 flex items-center gap-1"><FiTrash2 className="w-4 h-4" /> حذف</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out both;
        }
      `}</style>
    </div>
  );
}