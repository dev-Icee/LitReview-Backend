const express = require('express');

const userController = require('./../controller/userController');
const authController = require('./../controller/authController');

const router = express.Router();

router.route('/').get(userController.getUsers);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMyPassword', authController.updateMyPassword);
router.patch('/updateMe', userController.changeMe);

module.exports = router;
