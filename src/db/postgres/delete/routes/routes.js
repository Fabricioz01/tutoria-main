import express from 'express';
import DeletePostgres from '../delete.js';

const router = express.Router();
const deletePostgres = new DeletePostgres();

router.delete('/eliminarFila', async (req, res) => {
  const { tableName, id } = req.body;
  try {
    const result = await deletePostgres.deleteTableData(tableName, id);
    res.json({ success: result });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar los datos de la tabla' });
  }
});

router.delete('/user/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const result = await deletePostgres.eliminarUsuariointerno(username);
    res.json({ success: true, message: 'Usuario eliminado correctamente', result });
  } catch (error) {
    console.error('Error al eliminar el usuario interno:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar el usuario interno' });
  }
});

export default router;
