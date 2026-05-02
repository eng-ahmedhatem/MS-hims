const Ticket = require('../models/Ticket');

exports.getStats = async (req, res) => {
  try {
    const total = await Ticket.countDocuments();
    const completed = await Ticket.countDocuments({ status: 'مكتمل' });
    const inProgress = await Ticket.countDocuments({ status: 'قيد التنفيذ' });
    const urgent = await Ticket.countDocuments({ priority: 'عاجل' });
    const recent = await Ticket.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      total,
      completed,
      inProgress,
      urgent,
      completionRate: total ? Math.round((completed / total) * 100) : 0,
      recent
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};