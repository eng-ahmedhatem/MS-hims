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

    res.json(buildReport(tickets, monthNum, yearNum));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطأ في جلب بيانات التقرير' });
  }
};

exports.getYearlyReportData = async (req, res) => {
  try {
    const { year } = req.query;
    const yearNum = parseInt(year, 10);
    if (!yearNum) return res.status(400).json({ message: 'السنة مطلوبة' });
    const startDate = new Date(yearNum, 0, 1);
    const endDate = new Date(yearNum + 1, 0, 1);
    const tickets = await Ticket.find({
      createdAt: { $gte: startDate, $lt: endDate }
    }).populate('assignedTo', 'fullName').sort({ createdAt: 1 });

    res.json(buildReport(tickets, 0, yearNum, true));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطأ في جلب بيانات التقرير السنوي' });
  }
};

function buildReport(tickets, monthNum, yearNum, isYearly = false) {
  const total = tickets.length;
  const completed = tickets.filter(t => t.status === 'مكتمل').length;
  const inProgress = tickets.filter(t => t.status === 'قيد التنفيذ').length;
  const cancelled = tickets.filter(t => t.status === 'ملغي').length;
  const pending = total - completed - inProgress - cancelled;
  const completionRate = total ? Math.round((completed / total) * 100) : 0;

  // إحصائيات الفنيين
  const techStats = {};
  tickets.forEach(t => {
    if (t.assignedTo) {
      const techId = t.assignedTo._id.toString();
      if (!techStats[techId]) {
        techStats[techId] = {
          name: t.assignedTo.fullName,
          total: 0,
          completed: 0,
          avgHours: 0,
          totalHours: 0,
        };
      }
      techStats[techId].total++;
      if (t.status === 'مكتمل') {
        techStats[techId].completed++;
        const duration = t.completedAt
          ? Math.round((t.completedAt - t.createdAt) / (1000 * 60 * 60))
          : 0;
        techStats[techId].totalHours += duration;
      }
    }
  });

  Object.values(techStats).forEach(tech => {
    tech.avgHours = tech.completed
      ? Math.round(tech.totalHours / tech.completed)
      : 0;
  });

  // توزيع الأقسام
  const departments = {};
  tickets.forEach(t => {
    if (!departments[t.department]) departments[t.department] = 0;
    departments[t.department]++;
  });

  // إثراء بيانات التذاكر بمعلومات الوقت
  const enriched = tickets.map(t => ({
    ...t.toObject(),
    startDate: t.createdAt,
    endDate: t.status === 'مكتمل' ? t.completedAt : null,
    durationHours: t.completedAt
      ? Math.round((t.completedAt - t.createdAt) / (1000 * 60 * 60))
      : null,
  }));

  return {
    month: isYearly ? null : monthNum,
    year: yearNum,
    tickets: enriched,
    summary: {
      total,
      completed,
      inProgress,
      cancelled,
      pending,
      completionRate,
      departments,
      techStats: Object.values(techStats),
    },
  };
}