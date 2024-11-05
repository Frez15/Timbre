// api/delete-message.js

const dbConnect = require('./lib/mongodb');
const Message = require('./models/Message');

module.exports = async function handler(req, res) {
  if (req.method === 'DELETE') {
    await dbConnect();

    const { floor, apartment } = req.body;

    console.log('Received /api/delete-message request:', req.body);

    // Validación de campos requeridos
    if (!floor || !apartment) {
      console.log('Faltan floor o apartment.');
      return res.status(400).json({ message: 'Faltan floor o apartment.' });
    }

    try {
      // Buscar y eliminar el mensaje pendiente
      const result = await Message.findOneAndDelete({ floor: floor, apartment: apartment, status: 'pending' });

      if (!result) {
        console.log('No se encontró ningún mensaje pendiente para este timbre.');
        return res.status(404).json({ message: 'Mensaje pendiente no encontrado.' });
      }

      console.log('Mensaje eliminado:', result);

      return res.status(200).json({ message: 'Mensaje eliminado exitosamente.' });
    } catch (error) {
      console.error('Error al eliminar el mensaje:', error);
      return res.status(500).json({ message: 'Error al eliminar el mensaje.' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Método ${req.method} no permitido.`);
  }
};
