// api/models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  floor: {
    type: Number,
    required: true,
  },
  apartment: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: false,
  },
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
