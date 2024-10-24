const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Función para enviar notificación push
function enviarNotificacion(token) {
    const message = {
        notification: {
            title: '¡Timbre tocado!',
            body: 'Alguien ha tocado el timbre.'
        },
        token: token // El token del dispositivo que recibirá la notificación
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
