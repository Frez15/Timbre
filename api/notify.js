// api/notify.js

const admin = require('firebase-admin');

// Inicializar Firebase usando variables de entorno
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Formato para saltos de línea
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
     

    })
  });
}

// Handler para la solicitud de notificación
module.exports = async function handler(req, res) { // Usar module.exports en lugar de export default
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { token, title, body } = req.body;

  if (!token || !title || !body) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }
  console.log('Token recibido:', token);  // Log para verificar el token
  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: token, // Token del dispositivo que recibirá la notificación
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Notificación enviada correctamente:', response);
    return res.status(200).json({ message: 'Notificación enviada con éxito', response });
  } catch (error) {
    console.error('Error enviando notificación:', error);
    return res.status(500).json({ message: 'Error enviando notificación', error: error.message });
  }
};
