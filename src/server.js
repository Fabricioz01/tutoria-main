// src/server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import backupRoutes from './db/postgres/backups/routes/routes.js'; 
import createRoutes from './db/postgres/create/routes/routes.js'; 
import readRoutes from './db/postgres/read/routes/routes.js'; 
import updateRoutes from './db/postgres/update/routes/routes.js'; 
import deleteRoutes from './db/postgres/delete/routes/routes.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Middleware para manejar JSON
app.use(express.json());
// Middleware para configurar la política de seguridad de contenido (CSP)

app.use(express.static(path.join(__dirname, '..', 'public')));


app.use('/postgres', backupRoutes); // Añadir las rutas de respaldo
app.use('/postgres/create', createRoutes);
app.use('/postgres/read', readRoutes);
app.use('/postgres/update', updateRoutes);
app.use('/postgres/delete', deleteRoutes);



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
