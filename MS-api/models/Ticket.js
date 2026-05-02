const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketNumber: { type: String, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  department: {
    type: String,
    enum: ['صيانة', 'تكييف', 'سباكة', 'كهرباء', 'أخرى'],
    default: 'أخرى'
  },
  priority: {
    type: String,
    enum: ['عادي', 'متوسط', 'عاجل'],
    default: 'عادي'
  },
  status: {
    type: String,
    enum: ['جديد', 'قيد المراجعة', 'قيد التنفيذ', 'مكتمل', 'ملغي'],
    default: 'جديد'
  },
  createdBy: {
    name: { type: String, required: true },
    office: { type: String },
    contact: { type: String }
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  notes: [
    {
      text: String,
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

// توليد رقم التذكرة تلقائياً
ticketSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      // البحث عن آخر تذكرة (أكبر رقم حالياً)
      const lastTicket = await this.constructor
        .findOne({})
        .sort({ ticketNumber: -1 })
        .select('ticketNumber')
        .lean();

      let nextNumber = 1;
      if (lastTicket && lastTicket.ticketNumber) {
        // استخراج الرقم من صيغة TIC-xxxx
        const match = lastTicket.ticketNumber.match(/\d+/);
        if (match) {
          nextNumber = parseInt(match[0], 10) + 1;
        }
      }

      this.ticketNumber = `TIC-${String(nextNumber).padStart(4, '0')}`;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);