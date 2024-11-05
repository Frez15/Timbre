// api/notify.js

const dbConnect = require('./lib/mongodb');
const User = require('./models/User');
const admin = require('firebase-admin');

// Inicializar Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    }),
  });
}

module.exports = async function handler(req, res) {
  if (req.method === 'POST') {
    await dbConnect();

    const { floor, apartment, title, body } = req.body;

    console.log('Received /api/notify request:', req.body);

    // Validación de campos requeridos
    if (floor === undefined || !apartment) {
      console.log('Faltan piso o departamento.');
      return res.status(400).json({ message: 'Faltan piso o departamento.' });
    }

    try {
      // Buscar al usuario por piso y departamento
      const user = await User.findOne({ floor: Number(floor), apartment });

      console.log('Usuario encontrado:', user);

      if (!user || !user.token) {
        console.log('Usuario no encontrado o sin token.');
        return res.status(404).json({ message: 'Usuario no encontrado o sin token.' });
      }

      // Crear el payload de la notificación
      const payload = {
        notification: {
          title: title || 'Timbre Presionado',
          body: body || 'Alguien tocó el timbre.',
        },
      };

      console.log('Enviando notificación con payload:', payload);

      // Enviar la notificación mediante FCM
      const response = await admin.messaging().sendToDevice(user.token, payload);

      console.log('Respuesta de FCM:', response);

      return res.status(200).json({ message: 'Notificación enviada exitosamente.', response });
    } catch (error) {
      console.error('Error al enviar la notificación:', error);
      return res.status(500).json({ message: 'Error al enviar la notificación.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido.`);
  }
};
