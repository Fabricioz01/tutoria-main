
// Importamos el módulo 'pg' que nos permite interactuar con bases de datos PostgreSQL
import pkg from 'pg';

// Extraemos la clase 'Pool' del paquete 'pg' para crear un grupo de conexiones a la base de datos
const { Pool } = pkg;

// Creamos una instancia de 'Pool' con la configuración necesaria para conectarnos a nuestra base de datos
const pool = new Pool({
  user: 'postgres',    
  host: 'localhost',   
  database: 'hotel',   
  password: '7410',    
  port: 5432,         
});

// Intentamos establecer una conexión al grupo de conexiones creado anteriormente
pool.connect((err, client, release) => {
  if (err) {
    // Si ocurre un error al intentar conectar, lo mostramos en la consola
    return console.error('Error al conectar a la base de datos:', err.stack);
  }
  // Si la conexión es exitosa, mostramos un mensaje en la consola
  console.log('Conexión establecida con la base de datos PostgresSQL');
  // Liberamos el cliente para que pueda ser reutilizado por otras consultas
  release();
});

// Exportamos el grupo de conexiones para poder usarlo en otras partes de nuestra aplicación
export default pool;
