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
    const { status, note, assignedTo, technicianStatus } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'الطلب غير موجود' });

    // تحديث الحالة العامة (للصلاحيات الإدارية)
    if (status) {
      if (status === 'مكتمل' && !ticket.completedAt) {
        ticket.completedAt = new Date();
      }
      ticket.status = status;
    }

    // تحديث حالة الفني (إن وُجدت)
    if (technicianStatus) {
      ticket.technicianStatus = technicianStatus;
    }

    // إسناد فني
    if (assignedTo !== undefined) {
      ticket.assignedTo = assignedTo || null;
    }

    // إضافة ملاحظة
    if (note) {
      ticket.notes.push({ text: note, createdBy: req.user._id });
    }

    // منطق الإكمال التلقائي: إذا وافق الطرفان يصبح "مكتمل"
    if (ticket.creatorStatus === 'تم الإصلاح' && ticket.technicianStatus === 'تم الإصلاح') {
      if (ticket.status !== 'مكتمل') {
        ticket.status = 'مكتمل';
        if (!ticket.completedAt) ticket.completedAt = new Date();
      }
    }
    // إذا رفض أحدهما وكانت الحالة مكتملة، نعيدها إلى "قيد التنفيذ"
    else if (ticket.status === 'مكتمل' &&
             (ticket.creatorStatus === 'لم يتم الإصلاح' || ticket.technicianStatus === 'لم يتم الإصلاح')) {
      ticket.status = 'قيد التنفيذ';
      ticket.completedAt = null;
    }

    await ticket.save();

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

// تحديث حالة الطلب من قبل مقدم الطلب (عام – عبر رقم التذكرة)
exports.updateCreatorStatus = async (req, res) => {
  try {
    const { ticketNumber } = req.params;
    const { creatorStatus } = req.body;

    if (!creatorStatus || !['تم الإصلاح', 'لم يتم الإصلاح'].includes(creatorStatus)) {
      return res.status(400).json({ message: 'حالة غير صالحة' });
    }

    const ticket = await Ticket.findOne({ ticketNumber });
    if (!ticket) return res.status(404).json({ message: 'الطلب غير موجود' });

    ticket.creatorStatus = creatorStatus;

    // منطق الإكمال التلقائي
    if (ticket.creatorStatus === 'تم الإصلاح' && ticket.technicianStatus === 'تم الإصلاح') {
      if (ticket.status !== 'مكتمل') {
        ticket.status = 'مكتمل';
        if (!ticket.completedAt) ticket.completedAt = new Date();
      }
    } else if (ticket.status === 'مكتمل' &&
               (ticket.creatorStatus === 'لم يتم الإصلاح' || ticket.technicianStatus === 'لم يتم الإصلاح')) {
      ticket.status = 'قيد التنفيذ';
      ticket.completedAt = null;
    }

    await ticket.save();

    res.json(await Ticket.findOne({ ticketNumber }).populate('assignedTo', 'fullName'));
  } catch (error) {
    res.status(400).json({ message: 'فشل التحديث', error: error.message });
  }
};

// حذف التذكرة من قبل مقدم الطلب (عام – عبر رقم التذكرة)
exports.deleteByCreator = async (req, res) => {
  try {
    const { ticketNumber } = req.params;
    const ticket = await Ticket.findOne({ ticketNumber });
    if (!ticket) return res.status(404).json({ message: 'الطلب غير موجود' });

    // يسمح بالحذف فقط إذا كانت الحالة مكتملة أو ملغاة
    if (!['مكتمل', 'ملغي'].includes(ticket.status)) {
      return res.status(400).json({ message: 'يمكن حذف الطلب فقط بعد اكتماله أو إلغائه' });
    }

    await ticket.deleteOne();
    res.json({ message: 'تم حذف التذكرة بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};