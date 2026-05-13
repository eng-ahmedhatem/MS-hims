const router = require('express').Router();
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
  createTicket,
  trackTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  updateCreatorStatus,
   deleteByCreator
} = require('../controllers/ticketController');

// عام
router.post('/', createTicket);
router.get('/track/:ticketNumber', trackTicket);
// تحديث حالة مقدم الطلب (عام)
router.put('/track/:ticketNumber', updateCreatorStatus);
// حذف من قبل مقدم الطلب (عام)
router.delete('/track/:ticketNumber', deleteByCreator);

// مسارات محمية
router.get('/', protect, getAllTickets);
router.get('/:id', protect, getTicketById);
router.put('/:id', protect, authorize('admin', 'manager', 'technician'), updateTicket);
router.delete('/:id', protect, authorize('admin', 'manager', ), deleteTicket);
module.exports = router;