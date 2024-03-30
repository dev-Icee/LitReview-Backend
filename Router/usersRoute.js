const express = require('express');

const userController = require('./../controller/userController');
const authController = require('./../controller/authController');

const router = express.Router();

router.route('/').get(userController.getUsers);
router.post('/signup', authController.signup);

module.exports = router;
