// api/notify.js
import admin from 'firebase-admin';

// Inicializar Firebase Admin usando variables de entorno
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            type: process.env.FIREBASE_TYPE,
            project_id: process.env.FIREBASE_PROJECT_ID,
            private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
            private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            client_id: process.env.FIREBASE_CLIENT_ID,
        }),
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
