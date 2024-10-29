const express = require('express');
const admin = require('firebase-admin');
const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar Firebase usando variables de entorno
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

// Middleware para interpretar JSON en el body de la solicitud
app.use(express.json());

// Ruta para tocar el timbre
app.post('/api/tocar-timbre', (req, res) => { // Cambié a '/api/tocar-timbre'
  const { token } = req.body; // Recibe el token desde la solicitud
  console.log('¡Timbre tocado!');

  // Asegúrate de que el token esté presente
  if (!token) {
    return res.status(400).json({ message: 'Token es requerido' });
  }

  // Llamar a la función para enviar notificación
  enviarNotificacion(token);

  res.send('Timbre activado y notificación enviada.');
});

// Función para enviar notificación push
function enviarNotificacion(token) {
  const message = {
    notification: {
      title: '¡Timbre tocado!',
      body: 'Alguien ha tocado el timbre.'
    },
    token: token // Token del dispositivo que recibirá la notificación
  };

  admin.messaging().send(message)
    .then((response) => {
      console.log('Notificación enviada:', response);
    })
    .catch((error) => {
      console.error('Error enviando notificación:', error);
    });
}

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
