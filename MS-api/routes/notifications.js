const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getMyNotifications, markAllRead, getUnreadCount, markOneRead } = require('../controllers/notificationController');

router.get('/', protect, getMyNotifications);
router.put('/read-all', protect, markAllRead);
router.get('/unread-count', protect, getUnreadCount);
router.put('/:id/read', protect, markOneRead);

module.exports = router;