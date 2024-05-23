// src/db/postgres/create/create.js

import pool from '../conexion/conexiondb.js';

class CreatePostgres {
  async insertarDatos(tableName, campos, valores) {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT crear($1, $2, $3) AS success', [tableName, campos, valores]);
      const { success } = result.rows[0];
      return success;
    } catch (error) {
      console.error('Error inserting data:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  async createRole(roleName, permissions) {
    console.log('Datos recibidos para crear el rol:', roleName, permissions);
    const client = await pool.connect();
    try {
      const createRoleQuery = `CREATE ROLE ${roleName}`;
      await client.query(createRoleQuery);

      if (permissions.length > 0) {
        const grantPermissionsQuery = `GRANT ${permissions.join(', ')} ON ALL TABLES IN SCHEMA public TO "${roleName}"`;

        await client.query(grantPermissionsQuery);
      }

      return { success: true };
    } catch (err) {
      console.error(`Error al crear el rol ${roleName}:`, err);
      throw err;
    } finally {
      client.release();
    }
  }

  async createUser(username, password, roleName) {
    console.log('Datos  a crear recibidos:', username,password,roleName);
    const client = await pool.connect();
    try {
      // Primero, creamos el usuario en la base de datos
      const createUserQuery = `CREATE USER ${username} WITH PASSWORD '${password}'`;
      await client.query(createUserQuery);

      // Luego, le asignamos el rol correspondiente al usuario
      const assignRoleQuery = `GRANT ${roleName} TO ${username}`;
      await client.query(assignRoleQuery);

      return { success: true };
    } catch (err) {
      console.error(`Error al crear el usuario ${username}:`, err);
      throw err;
    } finally {
      client.release();
    }
  }

}


export default CreatePostgres;
