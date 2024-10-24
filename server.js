const express = require('express');
const { google } = require('googleapis');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Autenticar con Google Assistant API
function autenticar() {
    const auth = new google.auth.OAuth2(
        'CLIENT_ID',
        'CLIENT_SECRET',
        'REDIRECT_URI'
    );
    auth.setCredentials({ refresh_token: 'REFRESH_TOKEN' });
    return auth;
}

function sonarTimbre(auth) {
    const request = {
        auth: auth,
        // Acción para Google Nest
    };

    assistant.conversations.send(request, (err, response) => {
        if (err) {
            console.error('Error al sonar el timbre:', err);
            return;
        }
        console.log('Timbre sonado correctamente');
    });
}

function enviarNotificacion() {
    const message = {
        notification: {
            title: '¡Timbre tocado!',
            body: 'Alguien ha tocado el timbre.'
        },
        token: 'TOKEN_DEL_DISPOSITIVO'
    };

    admin.messaging().send(message)
        .then((response) => {
            console.log('Notificación enviada:', response);
        })
        .catch((error) => {
            console.log('Error enviando notificación:', error);
        });
}

// Ruta para tocar el timbre
app.get('/tocar-timbre', (req, res) => {
    console.log('¡Timbre tocado!');
    
    // Hacer sonar el timbre en Google Nest
    const auth = autenticar();
    sonarTimbre(auth);

    // Enviar notificación push
    enviarNotificacion();

    res.send('Timbre activado');
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
