// api/respond.js

const dbConnect = require('./lib/mongodb');
const Message = require('./models/Message');

module.exports = async function handler(req, res) {
  if (req.method === 'POST') {
    await dbConnect();

    const { floor, apartment, response } = req.body;

    console.log('Received /api/respond request:', req.body);

    // Validación de campos requeridos
    if (!floor || !apartment || !response) {
      console.log('Faltan floor, apartment o response.');
      return res.status(400).json({ message: 'Faltan floor, apartment o response.' });
    }

    try {
      // Buscar el mensaje por floor y apartment con estado 'pending'
      const messageDoc = await Message.findOne({ floor: floor, apartment: apartment, status: 'pending' });

      console.log('Mensaje encontrado para respuesta:', messageDoc);

      if (!messageDoc) {
        console.log('No se encontró ningún mensaje pendiente para este timbre.');
        return res.status(404).json({ message: 'Mensaje pendiente no encontrado.' });
      }

      // Actualizar el mensaje con la respuesta y cambiar el estado a 'responded'
      messageDoc.response = response;
      messageDoc.status = 'responded';
      await messageDoc.save();

      console.log('Mensaje actualizado con respuesta:', messageDoc);

      // Aquí podrías enviar una notificación al remitente original si es necesario

      return res.status(200).json({ message: 'Respuesta registrada exitosamente.' });
    } catch (error) {
      console.error('Error al registrar la respuesta:', error);
      return res.status(500).json({ message: 'Error al registrar la respuesta.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido.`);
  }
};
