import pool from '../conexion/conexiondb.js';

class DeletePostgres {
  async deleteTableData(tableName, id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT eliminar($1, $2)',
        [tableName, id]
      );
      return result.rows[0].eliminar;
    } catch (err) {
      console.error(`Error al eliminar los datos de la tabla ${tableName}:`, err);
      throw err;
    } finally {
      client.release();
    }
  }
  async eliminarUsuariointerno(username) {
    console.log('recibiendo usuario de db a eliminar: '+username)
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT eliminarUsuariointerno($1)',
        [username]
      );
      return result.rows[0].eliminarusuario; // Suponiendo que el nombre de la columna devuelta por la función es "eliminarusuario"
    } catch (err) {
      console.error(`Error al eliminar el usuario ${username}:`, err);
      throw err;
    } finally {
      client.release();
    }
  }
}



export default DeletePostgres;
