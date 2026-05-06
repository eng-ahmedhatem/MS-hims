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

// تحديث حالة الطلب وإضافة ملاحظة
exports.updateTicket = async (req, res) => {
  try {
    const { status, note, assignedTo } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'الطلب غير موجود' });

    // تحديث الحالة وتسجيل وقت الإنجاز عند الحاجة
    if (status) {
      // إذا كانت الحالة "مكتمل" ولم نسجل تاريخ الإنجاز بعد (حتى للتذاكر القديمة)
      if (status === 'مكتمل' && !ticket.completedAt) {
        ticket.completedAt = new Date();
      }
      ticket.status = status;
    }

    if (assignedTo !== undefined) {
      ticket.assignedTo = assignedTo || null;
    }

    if (note) {
      ticket.notes.push({ text: note, createdBy: req.user._id });
    }

    await ticket.save();

    // إعادة استعلام للحصول على البيانات المحدثة مع populate
    const updatedTicket = await Ticket.findById(ticket._id).populate('assignedTo', 'fullName');
    res.json(updatedTicket);
  } catch (error) {
    res.status(400).json({ message: 'فشل التحديث', error: error.message });
  }
};

// حذف طلب (مدير النظام فقط - بعد الاكتمال أو الإلغاء)
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'الطلب غير موجود' });

    if (!['مكتمل', 'ملغي'].includes(ticket.status)) {
      return res.status(400).json({ message: 'لا يمكن حذف الطلب إلا بعد اكتماله أو إلغائه' });
    }

    await ticket.deleteOne();
    res.json({ message: 'تم حذف التذكرة بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};