const dbConnect = require('./api/lib/mongodb');

dbConnect()
  .then(() => {
    console.log('Conectado a MongoDB exitosamente.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1);
  });
