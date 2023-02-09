const express = require('express');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} = require('../controllers/userControllers');
const {
  signup,
  login,
  forgotPassword,
  restPassword,
  updatePassword,
  protect,
  restrictTo,
} = require('../controllers/authController');

const router = express.Router();

// router.route('/signup').post(signup);
router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', restPassword);

// Router is like mini application
// So we can use this middleware on router so we dont have to copy replicate code
router.use(protect);

router.patch('/updateMyPassword', updatePassword);

router.patch('/updateMe', updateMe);
router.get('/me', getMe, getUser);

router.delete('/deleteMe', deleteMe);

router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
