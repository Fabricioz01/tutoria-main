// src/db/postgres/update/update.js

import pool from '../conexion/conexiondb.js';

class UpdatePostgres {
  async updateTableData(tableName, id, fields, values) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT actualizar($1, $2, $3, $4)',
        [tableName, id, fields, values]
      );
      return result.rows;
    } catch (err) {
      console.error(`Error al actualizar los datos de la tabla ${tableName}:`, err);
      throw err;
    } finally {
      client.release();
    }
  }
}

/*ESTA ES LA FUNCION QUE CREÉ EN MI BASE DE DATOS POSTGRESSQL

CREATE OR REPLACE FUNCTION actualizar(tabla text, id_to_update integer, campos_a_cambiar text[], nuevos_valores text[])
RETURNS INTEGER AS
$$
DECLARE
    num_campos integer;
    i integer := 1;
    campos_cambiados integer := 0;
BEGIN
    -- Validar que la cantidad de campos a cambiar sea igual a la cantidad de nuevos valores
    IF array_length(campos_a_cambiar, 1) <> array_length(nuevos_valores, 1) THEN
        RAISE EXCEPTION 'La cantidad de campos a cambiar no coincide con la cantidad de nuevos valores.';
    END IF;

    -- Obtener el número de campos en la tabla
    EXECUTE format('SELECT count(*) FROM information_schema.columns WHERE table_name = %L', tabla) INTO num_campos;

    -- Construir la cláusula SET para la actualización
    DECLARE
        set_clause text := '';
    BEGIN
        FOR i IN 1..array_length(campos_a_cambiar, 1) LOOP
            set_clause := set_clause || campos_a_cambiar[i] || ' = ' || quote_literal(nuevos_valores[i]);
            IF i < array_length(campos_a_cambiar, 1) THEN
                set_clause := set_clause || ', ';
            END IF;
        END LOOP;

        -- Actualizar la fila utilizando el id
        EXECUTE format('UPDATE %I SET %s WHERE id = %s', tabla, set_clause, id_to_update);
    END;

    RETURN 1; -- Devolver 1 indicando que la actualización fue exitosa
END;
$$
LANGUAGE plpgsql;


*/

export default UpdatePostgres;

