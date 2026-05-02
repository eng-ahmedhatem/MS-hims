
const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getManagers, getTechnicians, createUser, updateUser , deleteUser  } = require('../controllers/userController');

router.get('/managers', protect, adminOnly, getManagers);
router.get('/technicians', protect, adminOnly, getTechnicians);
router.post('/', protect, adminOnly, createUser);
router.put('/:id', protect, adminOnly, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);


module.exports = router;