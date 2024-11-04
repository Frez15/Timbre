// api/update-token.js

const dbConnect = require('./lib/mongodb');
const User = require('./models/User');

module.exports = async function handler(req, res) {
  if (req.method === 'POST') {
    await dbConnect();

    const { email, token } = req.body;

    // Validación de campos requeridos
    if (!email || !token) {
      return res.status(400).json({ message: 'Faltan campos requeridos.' });
    }

    try {
      // Buscar al usuario por email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      // Actualizar el token del usuario
      user.token = token;
      await user.save();

      return res.status(200).json({ message: 'Token actualizado exitosamente.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al actualizar el token.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido.`);
  }
};
