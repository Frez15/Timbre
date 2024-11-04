// api/register.js

const dbConnect = require('./lib/mongodb');
const User = require('./models/User');

module.exports = async function handler(req, res) {
  if (req.method === 'POST') {
    await dbConnect();

    const { name, email, floor, apartment, token } = req.body;

    // Validación de campos requeridos
    if (!name || !email || !floor || !apartment) {
      return res.status(400).json({ message: 'Faltan campos requeridos.' });
    }

    try {
      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: 'Usuario ya registrado.' });
      }

      // Crear un nuevo usuario
      const newUser = new User({
        name,
        email,
        floor,
        apartment,
        token,
      });

      await newUser.save();

      return res.status(201).json({ message: 'Usuario registrado exitosamente.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al registrar el usuario.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido.`);
  }
};
