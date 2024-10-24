// api/notify.js
import admin from 'firebase-admin';

const serviceAccount = require('./path/to/your/serviceAccountKey.json'); // Asegúrate de que la ruta sea correcta

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { token, title, body } = req.body;

        const message = {
            notification: {
                title: title,
                body: body,
            },
            token: token,
        };

        try {
            const response = await admin.messaging().send(message);
            return res.status(200).json({ success: true, response });
        } catch (error) {
            console.error("Error sending message:", error);
            return res.status(500).json({ success: false, error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
