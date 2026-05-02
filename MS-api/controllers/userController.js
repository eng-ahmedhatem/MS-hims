const User = require('../models/User');

exports.getManagers = async (req, res) => {
  const managers = await User.find({ role: { $in: ['admin', 'manager'] } });
  res.json(managers);
};

exports.getTechnicians = async (req, res) => {
  const techs = await User.find({ role: 'technician' });
  res.json(techs);
};

exports.createUser = async (req, res) => {
  try {
    const { username, password, fullName, email, role } = req.body;
    const user = await User.create({ username, password, fullName, email, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'فشل إنشاء المستخدم', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { fullName, email, role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { fullName, email, role, isActive }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'فشل التحديث' });
  }
};

// حذف مستخدم (مدير النظام فقط)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    // اختياري: منع المدير من حذف نفسه
    if (req.user._id.equals(user._id)) {
      return res.status(400).json({ message: 'لا يمكنك حذف حسابك الحالي' });
    }

    await user.deleteOne();
    res.json({ message: 'تم حذف المستخدم بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};