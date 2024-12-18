// api/lib/mongodb.js

const mongoose = require('mongoose');
require('dotenv').config(); // Cargar variables de entorno desde .env

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Por favor, define la variable de entorno MONGODB_URI en Vercel.'
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      // Las opciones `useNewUrlParser` y `useUnifiedTopology` ya no son necesarias
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = dbConnect;
