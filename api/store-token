// api/store-token.js

const admin = require('firebase-admin');

// Inicializar Firebase usando variables de entorno
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
    })
  });
}

// Suponiendo que estás almacenando el token en una variable en memoria (puedes usar una base de datos)
let storedToken = '';

// Handler para almacenar y obtener el token
module.exports = async function handler(req, res) {
  if (req.method === 'POST') {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Falta el token' });
    }

    console.log('Token recibido para almacenamiento:', token);
    storedToken = token; // Almacena el token en memoria (mejor usar una base de datos)

    return res.status(200).json({ message: 'Token almacenado correctamente' });
  } else if (req.method === 'GET') {
    // Devuelve el token almacenado
    return res.status(200).json({ token: storedToken });
  } else {
    return res.status(405).json({ message: 'Método no permitido' });
  }
};
