// api/models/Message.js

const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  floor: {
    type: String,
    required: true,
  },
  apartment: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.models.Message || mongoose.model('Message', MessageSchema);
