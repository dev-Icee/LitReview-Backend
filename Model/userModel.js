const { promisify } = require('util');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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
    required: [true, 'User must have  a password'],
    select: false
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

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.isNew) return next();

  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods('confirmPassword', async function(password) {
  const match = await promisify(bcrypt).compare(password, this.password);
  return match;
});

const User = new mongoose.model('User', userSchema);

module.exports = User;
