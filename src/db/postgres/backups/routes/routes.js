// src/db/postgres/backups/routes/routes.js
import express from 'express';
import Backups from '../backups.js';

const router = express.Router();

// Ruta para crear un respaldo
router.post('/backup', async (req, res) => {
  try {
    const backupFileName = await Backups.createBackup();
    res.json({ success: true, fileName: backupFileName });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

// Ruta para restaurar un respaldo
router.post('/restore', async (req, res) => {
  const { fileName } = req.body;
  try {
    const result = await Backups.restoreBackup(fileName);
    res.json({ success: true, message: result });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});



// Ruta para mostrar la lista de archivos de respaldo con botones de restauración
router.get('/mostrarespaldo', async (req, res) => {
  try {
    const backupListHtml = await Backups.showBackups();
    res.send(`
      <h2>Archivos de respaldo:</h2>
      <ul>${backupListHtml}</ul>
      <script>
        function restoreBackup(fileName) {
          fetch('/postgres/restore', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileName }),
          })
          .then(response => response.json())
          .then(result => {
            if (result.success) {
              alert('¡Restauración exitosa!');
            } else {
              alert('Error al restaurar la base de datos');
            }
          })
          .catch(error => {
            console.error('Error al restaurar la base de datos:', error);
            alert('Error al restaurar la base de datos');
          });
        }
      </script>
    `);
  } catch (error) {
    console.error('Error interno del servidor:', error); // Añadimos más detalles del error aquí
    res.status(500).send('Error interno del servidor');
  }
});


export default router;
