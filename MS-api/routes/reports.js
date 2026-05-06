const router = require('express').Router();
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { getMonthlyReportData } = require('../controllers/reportController');

router.get('/monthly', protect, authorize('admin'), getMonthlyReportData);

module.exports = router;