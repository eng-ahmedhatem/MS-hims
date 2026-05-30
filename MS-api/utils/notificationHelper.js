const Notification = require('../models/Notification');

exports.createNotification = async ({ recipient, type, message, ticket }) => {
  try {
    await Notification.create({ recipient, type, message, ticket });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

exports.notifyAdmins = async ({ type, message, ticket, excludeUser }) => {
  const User = require('../models/User');
  const admins = await User.find({ role: { $in: ['admin', 'manager'] }, isActive: true });
  admins.forEach(admin => {
    if (!excludeUser || admin._id.toString() !== excludeUser.toString()) {
      exports.createNotification({ recipient: admin._id, type, message, ticket });
    }
  });
};