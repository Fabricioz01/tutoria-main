// Función para obtener datos de una tabla específica y mostrarlos
async function fetchTableData(tableName) {
  try {
    const response = await fetch(`/postgres/read/getTableData/${tableName}`);
    const data = await response.json();
    const columns = data.columns;
    const tableData = data.rows;

    const tableDataContainer = document.getElementById('table-data');
    tableDataContainer.innerHTML = ''; // Clear previous data

    if (columns.length > 0) {
      const headerRow = document.createElement('div');
      headerRow.classList.add('table-row', 'header-row');

      // Create headers for each column
      columns.forEach(column => {
        const header = document.createElement('div');
        header.textContent = column;
        header.classList.add('table-header');
        headerRow.appendChild(header);
      });

      // Add an empty header for the buttons column
      const buttonsHeader = document.createElement('div');
      buttonsHeader.classList.add('table-header');
      headerRow.appendChild(buttonsHeader);

      tableDataContainer.appendChild(headerRow);

      // Create input row for adding new entries
      const inputRow = document.createElement('div');
      inputRow.classList.add('table-row', 'input-row');

      columns.forEach((column, index) => {
        const input = document.createElement('input');
        input.type = 'text';
        input.setAttribute('data-field', column);
        if (index === 0) {
          input.readOnly = true;
        }
        inputRow.appendChild(input);
      });

      // Add a button for creating new entries
      const createButtonDiv = document.createElement('div');
      createButtonDiv.classList.add('crear-button');
      const createButton = document.createElement('button');
      createButton.textContent = 'Crear Nuevo';
      createButton.addEventListener('click', async () => {
        const newFields = [];
        const newValues = [];

        inputRow.querySelectorAll('input').forEach((input, index) => {
          if (index !== 0) {
            newFields.push(input.getAttribute('data-field'));
            newValues.push(input.value);
          }
        });

        await insertTableData(tableName, newFields, newValues);
      });

      createButtonDiv.appendChild(createButton);
      inputRow.appendChild(createButtonDiv);
      tableDataContainer.appendChild(inputRow);
    }

    tableData.forEach(row => {
      const rowDiv = document.createElement('div');
      rowDiv.classList.add('table-row');

      // Create inputs for each field
      columns.forEach((column, index) => {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = row[column];
        input.setAttribute('data-field', column);
        if (index === 0) {
          input.readOnly = true;
        }
        rowDiv.appendChild(input);
      });

      // Create buttons
      const buttonsDiv = document.createElement('div');
      buttonsDiv.classList.add('buttons');


      const saveButton = document.createElement('button');
      saveButton.textContent = 'Guardar';
      saveButton.addEventListener('click', async () => {
        if (confirm('¿Estás seguro de que deseas guardar los cambios?')) {
          const updatedFields = [];
          const updatedValues = [];

          let rowId;

          // Recorrer los inputs y recopilar los datos actualizados
          rowDiv.querySelectorAll('input').forEach((input, index) => {
            if (index === 0) {
              // Obtener el valor de rowId del primer input
              rowId = input.value;
            } else {
              updatedFields.push(input.getAttribute('data-field'));
              updatedValues.push(input.value);
            }
          });

          console.log('Datos a actualizar:', { tableName, id: rowId, fields: updatedFields, values: updatedValues });

          await updateTableData(tableName, rowId, updatedFields, updatedValues);
          alert('Datos actualizados correctamente');
        }
      });

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Eliminar';
      deleteButton.addEventListener('click', async () => {
        if (confirm('¿Estás seguro de que deseas eliminar esta fila?')) {
          let rowId;
          rowDiv.querySelectorAll('input').forEach((input, index) => {
            if (index === 0) {
              rowId = input.value;
            }
          });
          try {
            const response = await fetch('/postgres/delete/eliminarFila', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ tableName, id: rowId }),
            });

            if (!response.ok) {
              throw new Error('Error en la eliminación de datos');
            }

            const result = await response.json();

            if (result.success) {
              rowDiv.remove();
              alert('Fila eliminada correctamente');
            } else {
              alert('Error al eliminar la fila');
            }
          } catch (error) {
            console.error('Error eliminando los datos:', error);
            alert('Error al eliminar la fila');
          }
        }
      });

      buttonsDiv.appendChild(saveButton);
      buttonsDiv.appendChild(deleteButton);

      rowDiv.appendChild(buttonsDiv);
      tableDataContainer.appendChild(rowDiv);
    });

    showModal();
  } catch (error) {
    console.error(`Error al obtener datos para la tabla ${tableName}:`, error);
  }
}



// Función para mostrar el modal
function showModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'block';

  const closeButton = modal.querySelector('.close-button'); // Selección del botón de cerrar dentro del modal actual
  closeButton.addEventListener('click', hideModal);

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      hideModal();
    }
  });
}

// Función para ocultar el modal
function hideModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
}

// Cargar nombres de tablas cuando el documento está listo
document.addEventListener('DOMContentLoaded', fetchTableNames);
