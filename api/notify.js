// Importar las dependencias necesarias
const admin = require('firebase-admin');

// Inicializar Firebase Admin SDK
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log('Firebase Admin Initialized');
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

const firestore = admin.firestore();

// Exportar el handler de la función
module.exports = async function handler(req, res) {
  if (req.method === 'POST') {
    const { floor, apartment, sender, receiver, message } = req.body;

    // Validaciones básicas
    if (!floor || !apartment || !sender || !receiver || !message) {
      return res.status(400).json({ message: 'Faltan campos necesarios.' });
    }

    try {
      // Escribir el mensaje en Firestore
      const firestoreMessage = {
        floor,
        apartment,
        message,
        sender,
        receiver,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await firestore.collection('messages').add(firestoreMessage);

      console.log('Mensaje guardado en Firestore:', firestoreMessage);

      return res.status(201).json({
        message: 'Mensaje pendiente creado exitosamente.',
        data: firestoreMessage,
      });
    } catch (error) {
      console.error('Error al crear el mensaje pendiente:', error);
      return res.status(500).json({ message: 'Error al crear el mensaje pendiente.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido.`);
  }
};
