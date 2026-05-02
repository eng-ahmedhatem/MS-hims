import { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function Settings() {
  const [institutionName, setInstitutionName] = useState('');

  useEffect(() => {
    axios.get('/api/settings').then(res => setInstitutionName(res.data.institutionName));
  }, []);

  const handleSave = async () => {
    await axios.put('/api/settings', { institutionName });
    alert('تم الحفظ');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">إعدادات النظام</h2>
      <label className="block mb-2">اسم المؤسسة:</label>
      <input value={institutionName} onChange={e => setInstitutionName(e.target.value)} className="w-full p-2 border rounded mb-4" />
      <button onClick={handleSave} className="bg-primary text-white py-2 px-6 rounded">حفظ</button>
    </div>
  );
}