const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    minLength: 6,
    required: [true, 'User must have  a password']
    // ,
    // select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Password does not match'],
    validate: {
      validator: function(el) {
        return this.password === el;
      },
      message: 'Password does not match'
    }
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
});

const User = new mongoose.model('User', userSchema);

module.exports = User;
