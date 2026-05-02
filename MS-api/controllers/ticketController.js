const Ticket = require('../models/Ticket');

// إنشاء طلب (عام - بدون تسجيل دخول)
exports.createTicket = async (req, res) => {
  try {
    const { title, description, department, priority, createdBy } = req.body;
    const ticket = await Ticket.create({
      title,
      description,
      department,
      priority,
      createdBy
    });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ message: 'فشل إنشاء الطلب', error: error.message });
  }
};

// تتبع طلب برقم التذكرة (عام)
exports.trackTicket = async (req, res) => {
  try {
    const { ticketNumber } = req.params;
    const ticket = await Ticket.findOne({ ticketNumber }).populate('assignedTo', 'fullName');
    if (!ticket) return res.status(404).json({ message: 'الطلب غير موجود' });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

// الحصول على كل الطلبات (للـ admin/manager)
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('assignedTo', 'fullName').sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

// الحصول على طلب واحد بالـ ID (للـ admin/manager)
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('assignedTo', 'fullName');
    if (!ticket) return res.status(404).json({ message: 'الطلب غير موجود' });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};
// حذف تذكرة (مدير النظام فقط)
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'الطلب غير موجود' });

    // مسموح بالحذف فقط إذا كانت الحالة "مكتمل" أو "ملغي"
    if (!['مكتمل', 'ملغي'].includes(ticket.status)) {
      return res.status(400).json({ message: 'لا يمكن حذف الطلب إلا بعد اكتماله أو إلغائه' });
    }

    await ticket.deleteOne();
    res.json({ message: 'تم حذف التذكرة بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

// تحديث حالة الطلب وإضافة ملاحظة
exports.updateTicket = async (req, res) => {
  try {
    const { status, note, assignedTo } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'الطلب غير موجود' });

    if (status) ticket.status = status;
    if (assignedTo) ticket.assignedTo = assignedTo;
    if (note) {
      ticket.notes.push({ text: note, createdBy: req.user._id });
    }

    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(400).json({ message: 'فشل التحديث', error: error.message });
  }
};


exports.getAllTickets = async (req, res) => {
  try {
    let filter = {};
    // الفني لا يرى إلا الطلبات المسندة إليه
    if (req.user.role === 'technician') {
      filter.assignedTo = req.user._id;
    }
    const tickets = await Ticket.find(filter)
      .populate('assignedTo', 'fullName')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};



exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('assignedTo', 'fullName');
    if (!ticket) return res.status(404).json({ message: 'الطلب غير موجود' });

    // الفني لا يستطيع مشاهدة تذكرة غير مسندة إليه
    if (
      req.user.role === 'technician' &&
      (!ticket.assignedTo || !ticket.assignedTo._id.equals(req.user._id))
    ) {
      return res.status(403).json({ message: 'غير مصرح لك بمشاهدة هذا الطلب' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};



exports.updateTicket = async (req, res) => {
  try {
    const { status, note, assignedTo } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'الطلب غير موجود' });

    // الفني لا يستطيع تعديل تذكرة غير مسندة إليه
    if (
      req.user.role === 'technician' &&
      (!ticket.assignedTo || !ticket.assignedTo._id.equals(req.user._id))
    ) {
      return res.status(403).json({ message: 'لا يمكنك تعديل هذا الطلب' });
    }

    if (status) ticket.status = status;
    if (assignedTo) ticket.assignedTo = assignedTo;
    if (note) {
      ticket.notes.push({ text: note, createdBy: req.user._id });
    }
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(400).json({ message: 'فشل التحديث', error: error.message });
  }
};



exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'الطلب غير موجود' });

    // الفني لا يستطيع حذف تذكرة غير مسندة إليه
    if (
      req.user.role === 'technician' &&
      (!ticket.assignedTo || !ticket.assignedTo._id.equals(req.user._id))
    ) {
      return res.status(403).json({ message: 'لا يمكنك حذف هذا الطلب' });
    }

    if (!['مكتمل', 'ملغي'].includes(ticket.status)) {
      return res.status(400).json({ message: 'لا يمكن حذف الطلب إلا بعد اكتماله أو إلغائه' });
    }

    await ticket.deleteOne();
    res.json({ message: 'تم حذف التذكرة بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};