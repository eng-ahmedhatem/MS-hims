const Ticket = require('../models/Ticket');

exports.getMonthlyReportData = async (req, res) => {
  try {
    const { month, year } = req.query;
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (!monthNum || !yearNum || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ message: 'الشهر والسنة مطلوبان' });
    }

    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 1);

    const tickets = await Ticket.find({
      createdAt: { $gte: startDate, $lt: endDate }
    }).populate('assignedTo', 'fullName').sort({ createdAt: 1 });

    const total = tickets.length;
    const completed = tickets.filter(t => t.status === 'مكتمل').length;
    const inProgress = tickets.filter(t => t.status === 'قيد التنفيذ').length;
    const cancelled = tickets.filter(t => t.status === 'ملغي').length;
    const pending = total - completed - inProgress - cancelled;
    const completionRate = total ? Math.round((completed / total) * 100) : 0;

    const departments = {};
    tickets.forEach(t => {
      if (!departments[t.department]) departments[t.department] = 0;
      departments[t.department]++;
    });

    res.json({
      month: monthNum,
      year: yearNum,
      tickets,
      summary: {
        total,
        completed,
        inProgress,
        cancelled,
        pending,
        completionRate,
        departments,
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطأ في جلب بيانات التقرير' });
  }
};