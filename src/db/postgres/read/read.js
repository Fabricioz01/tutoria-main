// src/db/postgres/read/read.js

import pool from '../conexion/conexiondb.js';

class ReadPostgres {
  async getTableNames() {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM get_table_names()');
      return result.rows.map(row => row.table_name);
    } catch (err) {
      console.error('Error al obtener los nombres de las tablas:', err);
      throw err;
    } finally {
      client.release();
    }
  }

  async getTableData(tableName) {
    const client = await pool.connect();
    try {
      const result = await client.query(`SELECT * FROM ${tableName} ORDER BY id ASC`);
      // Obtener los nombres de las columnas desde result.fields
      const columns = result.fields.map(field => field.name);
      return {
        columns,
        rows: result.rows
      };
    } catch (err) {
      console.error(`Error al obtener los datos de la tabla ${tableName}:`, err);
      throw err;
    } finally {
      client.release();
    }
  }

  async getRoles() {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT rolname FROM pg_roles WHERE rolname != $1', ['postgres']);
      const conmapeo=result.rows.map(row => row.rolname);
      return { 
        conmapeo,
        fila: result.rows
      };
      
    } catch (err) {
      console.error('Error al obtener los roles:', err);
      throw err;
    } finally {
      client.release();
    }
  }
  async getUsuariosConRoles(){
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM usarioRoles()');
        return result.rows
    } catch (error) {
        console.error('Error al obtener los usuarios con roles:', error);
        res.status(500).json({ success: false, error: 'Error al obtener los usuarios con roles' });
    }
};

}



export default ReadPostgres;
