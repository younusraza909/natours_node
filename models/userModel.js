/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },

  email: {
    type: String,
    required: [true, 'Please tell us your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // this only works on CREATE && SAVE!!!
      message: 'Password and confirm password should be same',
      validator: function (el) {
        return el === this.password;
      },
    },
  },
});

userSchema.pre('save', async function (next) {
  // in mongoose every document has isModilfied keyword to check if a certain field get the new data or in other words was modified or not
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

// Instance Method
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // here this keyword point to current document
  // but currently we have add select fale for password so we dont have access to password
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);
