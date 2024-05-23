
CREATE OR REPLACE FUNCTION usarioRoles()
RETURNS TABLE(username TEXT, rolname TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT u.usename::TEXT AS username, r.rolname::TEXT AS rolname
    FROM pg_user u
    LEFT JOIN pg_auth_members m ON u.usesysid = m.member
    LEFT JOIN pg_roles r ON m.roleid = r.oid;
END;
$$ LANGUAGE plpgsql;


--EJEMPLO DE USO SELECT * FROM usarioRoles();

CREATE OR REPLACE FUNCTION crear(tabla text, campos text[], valores text[])
RETURNS BOOLEAN AS
$$
DECLARE
    sql text;
BEGIN
    sql := format('INSERT INTO public.%I (%s) VALUES (%s)', 
                  tabla, 
                  array_to_string(campos, ','), 
                  array_to_string((SELECT array_agg(format('%L', val)) FROM unnest(valores) val), ','));
    EXECUTE sql;
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$
LANGUAGE plpgsql;

--EJEMPLO DE USO SELECT crear('usuarios', ARRAY['nombre', 'correo'], ARRAY['Juan', 'angel@example.com']);


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


-- EJEMPLO DE USO SELECT  actualizar('usuarios', 1, ARRAY['nombre', 'edad'], ARRAY['Pedro', '25']);

CREATE OR REPLACE FUNCTION eliminar(tabla text, id_to_delete integer)
RETURNS BOOLEAN AS
$$
BEGIN
    EXECUTE format('DELETE FROM %I WHERE id = %L', tabla, id_to_delete);
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$
LANGUAGE plpgsql;

--EJEMPLO DE USO  SELECT eliminar('hoteles', 1);

CREATE OR REPLACE FUNCTION eliminarUsuariointerno(username TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Verificamos si el usuario existe antes de eliminarlo
    IF EXISTS (SELECT 1 FROM pg_user WHERE usename = username) THEN
        -- Ejecutamos la sentencia SQL para eliminar el usuario
        EXECUTE format('DROP USER %I', username);
        RETURN TRUE; -- Indicamos que se eliminó el usuario correctamente
    ELSE
        RETURN FALSE; -- Indicamos que el usuario no existe
    END IF;
END;
$$ LANGUAGE plpgsql;

--EJEMPLO DE USO SELECT eliminarUsuariointerno('usuario1');
