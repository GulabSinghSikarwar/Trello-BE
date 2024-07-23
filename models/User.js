const { mongoose, Types } = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: false },
  isTotpEnable: {
    type: Boolean, default: true,
  },
  is2FAEnabled: {
    type: Boolean, default: true,
  },
  isFirstTimeLogin: {
    type: Boolean, default: false,
  },
  totpSecret: String, // For storing 2FA secret
  qrCodeUri: String, // For Totp Secret Key

});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;