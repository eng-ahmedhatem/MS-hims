const router = require('express').Router();
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { getMonthlyReportData, getYearlyReportData } = require('../controllers/reportController');

router.get('/monthly', protect, authorize('admin'), getMonthlyReportData);
router.get('/yearly', protect, authorize('admin'), getYearlyReportData);

module.exports = router;