import { exec } from 'child_process';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Backups {

  static async createBackup() {
    return new Promise((resolve, reject) => {
      const backupFileName = 'backup_' + Date.now() + '.sql';
      const backupFilePath = path.join(__dirname, '..', '..', '..', '..', 'public', 'backups', backupFileName);
  
      const backupCommand = `pg_dump -U postgres -h localhost -d hotel -f ${backupFilePath}`;
  
      exec(backupCommand, (error, stdout, stderr) => {
        if (error) {
          console.error('Error al realizar el respaldo de la base de datos:', error);
          reject('Error al realizar el respaldo de la base de datos');
        } else {
          console.log('Respaldo de la base de datos realizado con éxito');
          resolve(backupFileName);
        }
      });
    });
  };
  

  static async showBackups() {
    return new Promise((resolve, reject) => {
      const backupsFolderPath = path.join(__dirname, '..', '..', '..', '..', 'public', 'backups');

      fs.readdir(backupsFolderPath, (err, files) => {
        if (err) {
          console.error('Error al leer la carpeta de respaldos:', err);
          reject('Error al leer la carpeta de respaldos');
        } else {
          const sqlFiles = files.filter(file => path.extname(file).toLowerCase() === '.sql');
          const backupListHtml = sqlFiles.map(file => `
            <li>
              <a href="/backups/${file}">${file}</a>
              <button onclick="restoreBackup('${file}')">Restaurar a partir de este archivo</button>
            </li>`).join('');
          resolve(backupListHtml);
        }
      });
    });
  };

  static async restoreBackup(fileName) {
    return new Promise((resolve, reject) => {
      const backupFilePath = path.join(__dirname, '..', '..', '..', '..', 'public', 'backups', fileName);
      const restoreCommand = `psql -U postgres -h localhost -d hotel < ${backupFilePath}`;

      exec(restoreCommand, (error, stdout, stderr) => {
        if (error) {
          console.error('Error al restaurar la base de datos:', error);
          reject('Error al restaurar la base de datos');
        } else {
          console.log('Restauración de la base de datos realizada con éxito');
          resolve('Restauración de la base de datos realizada con éxito');
        }
      });
    });
  }


};

export default Backups;
