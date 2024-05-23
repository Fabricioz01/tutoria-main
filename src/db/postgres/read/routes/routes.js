// src/db/postgres/read/readRoutes.js
import express from 'express';
import ReadPostgres from '../read.js';

const router = express.Router();
const readPostgres = new ReadPostgres();

router.get('/getTableNames', async (req, res) => {
  try {
    const nombreTablas = await readPostgres.getTableNames();
    res.json({ nombreTablas });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los nombres de las tablas' });
  }
});

router.get('/getTableData/:tableName', async (req, res) => {
  const { tableName } = req.params;
  try {
    const { columns, rows } = await readPostgres.getTableData(tableName);
    res.json({ columns, rows });
  } catch (err) {
    res.status(500).json({ error: `Error al obtener los datos de la tabla ${tableName}` });
  }
});

router.get('/getRoles', async (req, res) => {
  try {
    const roles = await readPostgres.getRoles();
    res.json(roles);
  } catch (error) {
    console.error('Error al obtener los roles:', error);
    res.status(500).json({ error: 'Error al obtener los roles' });
  }
});

router.get('/getUsuariosConRoles', async (req, res) => {
  try {
    const usuarioConRol = await readPostgres.getUsuariosConRoles();
    res.json(usuarioConRol);
  } catch (error) {
    console.error('Error al obtener los roles:', error);
    res.status(500).json({ error: 'Error al obtener los roles' });
  }
});



export default router;
