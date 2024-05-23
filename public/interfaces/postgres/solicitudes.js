// Función para insertar nuevos datos en la tabla
async function insertTableData(tableName, campos, valores) {
    try {
      const response = await fetch(`/postgres/create/insertarDatos/${tableName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ campos, valores }),
      });
  
      const result = await response.json();
      if (result.success) {
        alert('Datos insertados correctamente');
        fetchTableData(tableName); // Actualiza la vista de datos
      } else {
        alert('Error al insertar los datos');
      }
    } catch (error) {
      console.error('Error inserting data:', error);
      alert('Error al insertar los datos');
    }
  }
  
  // Función para obtener nombres de tablas y mostrar en la interfaz
  async function fetchTableNames() {
    try {
      const response = await fetch('/postgres/read/getTableNames');
      const data = await response.json();
      const tableNames = data.nombreTablas;
      const listElement = document.getElementById('table-names-list');
  
      tableNames.forEach(tableName => {
        const listItem = document.createElement('li');
        listItem.textContent = tableName;
        listItem.classList.add('table-name-item');
        listItem.addEventListener('click', () => fetchTableData(tableName));
        listElement.appendChild(listItem);
      });
    } catch (error) {
      console.error('Error fetching table names:', error);
    }
  }


  async function createNewEntry(tableName, newEntry) {
    try {
      const response = await fetch('/postgres/create/nuevaFila', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tableName, newEntry }),
      });
  
      if (!response.ok) {
        throw new Error('Error al crear una nueva fila');
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating new entry:', error);
    }
  }


  async function updateTableData(tableName, id, fields, values) {
    try {
      const response = await fetch('/postgres/update/actualizarTabla', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tableName, id, fields, values }),
      });
  
      if (!response.ok) {
        throw new Error('Error en la actualización de datos');
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating table data:', error);
    }
  }
  