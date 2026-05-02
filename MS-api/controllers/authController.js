const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور خاطئة' });
    }
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

exports.getProfile = async (req, res) => {
  const user = req.user;
  res.json(user);
};