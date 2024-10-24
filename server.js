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
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Importante para formatear el salto de línea
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

// Ruta para tocar el timbre
app.post('/tocar-timbre', (req, res) => {
    const { token } = req.body; // Recibe el token desde la solicitud
    console.log('¡Timbre tocado!');

    // Enviar notificación push al token del dispositivo
    enviarNotificacion(token);

    res.send('Timbre activado y notificación enviada.');
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
