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
  sender: { // Remitente del mensaje
    type: String,
    required: true,
  },
  receiver: { // Receptor del mensaje
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: { // Estado del mensaje: pending, responded, timed_out
    type: String,
    enum: ['pending', 'responded', 'timed_out'],
    default: 'pending',
  },
  response: { // Respuesta del receptor
    type: String,
    required: false,
  },
  expiresAt: { // Fecha y hora de expiración
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 5 * 60 * 1000), // 5 minutos después de la creación
  },
}, { timestamps: true });

// Crear un índice TTL para eliminar mensajes automáticamente después de que expiren
MessageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.models.Message || mongoose.model('Message', MessageSchema);
