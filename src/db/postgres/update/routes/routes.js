// src/db/postgres/update/routes.js

import express from 'express';
import UpdatePostgres from '../update.js';

const router = express.Router();
const updatePostgres = new UpdatePostgres();

router.put('/actualizarTabla', async (req, res) => {
  const { tableName, id, fields, values } = req.body;
  try {
    const result = await updatePostgres.updateTableData(tableName, id, fields, values);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar los datos de la tabla' });
  }
});

export default router;
