// api/get-message.js

const dbConnect = require('./lib/mongodb');
const Message = require('./models/Message');

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    await dbConnect();

    const { floor, apartment } = req.query;

    console.log('Received /api/get-message request:', req.query);

    // Validación de campos requeridos
    if (!floor || !apartment) {
      console.log('Faltan floor o apartment.');
      return res.status(400).json({ message: 'Faltan floor o apartment.' });
    }

    try {
      // Buscar el mensaje por floor y apartment
      const messageDoc = await Message.findOne({ floor: floor, apartment: apartment });

      console.log('Mensaje encontrado:', messageDoc);

      if (!messageDoc) {
        console.log('No se encontró ningún mensaje para este timbre.');
        return res.status(404).json({ message: 'No hay mensajes desde la app.' });
      }

      return res.status(200).json({ message: messageDoc.message });
    } catch (error) {
      console.error('Error al obtener el mensaje:', error);
      return res.status(500).json({ message: 'Error al obtener el mensaje desde la app.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Método ${req.method} no permitido.`);
  }
};
