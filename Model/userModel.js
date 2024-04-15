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
  },
  passwordChangedAt: Date
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.isNew) return next();

  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  this.passwordConfirm = undefined;
  next();
});

userSchema.method('confirmPassword', function(enteredPassword, hashedPassword) {
  return bcrypt.compare(enteredPassword, hashedPassword);
});

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
};

const User = new mongoose.model('User', userSchema);

module.exports = User;
