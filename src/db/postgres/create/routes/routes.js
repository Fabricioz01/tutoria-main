// src/db/postgres/create/routes/routes.js

import express from 'express';
import CreatePostgres from '../create.js';

const router = express.Router();
const createPostgres = new CreatePostgres();



router.post('/insertarDatos/:tableName', async (req, res) => {
  const { tableName } = req.params;
  const { campos, valores } = req.body;

  try {
    const success = await createPostgres.insertarDatos(tableName, campos, valores);
    res.json({ success });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ success: false, error: 'Error inserting data' });
  }
});

router.post('/role', async (req, res) => {
  const { roleName, permissions } = req.body;
  try {
    const result = await createPostgres.createRole(roleName, permissions);
    res.json(result);
  } catch (error) {
    console.error(`Error al crear el rol ${roleName}:`, error);
    res.status(500).json({ error: `Error al crear el rol ${roleName}` });
  }
});

router.post('/createUser', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const result = await createPostgres.createUser(username, password, role);
    res.json({ success: true });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ success: false, error: 'Error al crear el usuario' });
  }
});


export default router;
