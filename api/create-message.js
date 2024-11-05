// api/create-message.js

const dbConnect = require('./lib/mongodb');
const Message = require('./models/Message');

module.exports = async function handler(req, res) {
  if (req.method === 'POST') {
    await dbConnect();

    const { floor, apartment, sender, receiver, message } = req.body;

    console.log('Received /api/create-message request:', req.body);

    // Validación de campos requeridos
    if (!floor || !apartment || !sender || !receiver || !message) {
      console.log('Faltan campos necesarios.');
      return res.status(400).json({ message: 'Faltan campos necesarios.' });
    }

    try {
      // Crear un nuevo mensaje
      const newMessage = new Message({
        floor,
        apartment,
        sender,
        receiver,
        message,
      });

      await newMessage.save();

      console.log('Mensaje pendiente creado:', newMessage);

      // Opcional: Enviar una notificación al receptor inmediatamente
      // Aquí puedes reutilizar la lógica de tu endpoint /api/notify o extraerla a una función

      return res.status(201).json({ message: 'Mensaje pendiente creado exitosamente.', data: newMessage });
    } catch (error) {
      console.error('Error al crear el mensaje pendiente:', error);
      return res.status(500).json({ message: 'Error al crear el mensaje pendiente.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido.`);
  }
};
