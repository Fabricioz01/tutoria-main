document.addEventListener('DOMContentLoaded', () => {
    const rolesButton = document.getElementById('roles-button');
    const usuariosButton = document.getElementById('usuarios-button');
    const respaldoButton = document.getElementById('respaldo-button');
    const rolesContent = document.getElementById('roles-content');
    const usuariosContent = document.getElementById('usuarios-content');
    const respaldoContent = document.getElementById('respaldo-content');

    const closeButton = document.getElementsByClassName('close-button');

    const showContent = (content) => {
        hiddenContent(rolesContent, usuariosContent, respaldoContent);
        content.style.display = 'block';
    };

    const hiddenContent = (content1, content2, content3) => {
        content1.style.display = 'none';
        content2.style.display = 'none';
        content3.style.display = 'none';
    };

    rolesButton.addEventListener('click', () => {
        showContent(rolesContent);
        fetchRoles();
    });


    usuariosButton.addEventListener('click', () => {
        showContent(usuariosContent);
        fetchRoles();
        fetchUsersWithRoles();
    });
    respaldoButton.addEventListener('click', () => showContent(respaldoContent));

    for (let i = 0; i < closeButton.length; i++) {
        closeButton[i].addEventListener('click', function() {
            const parentContent = this.parentElement;
            parentContent.style.display = 'none';
        });
    }
    document.getElementById('create-user-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
    
        try {
            const response = await fetch('/postgres/create/createUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, role }),
            });
    
            const result = await response.json();
            if (result.success) {
                alert('Usuario creado exitosamente');
                fetchUsersWithRoles();
            } else {
                alert('Error al crear el usuario');
            }
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            alert('Error al crear el usuario');
        }
    });

    document.getElementById('create-role-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const roleName = document.getElementById('role-name').value;
        const permissions = Array.from(document.querySelectorAll('input[name="permissions"]:checked')).map(checkbox => checkbox.value);

        try {
            const response = await fetch('/postgres/create/role', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roleName, permissions }),
            });

            const result = await response.json();
            if (result.success) {
                alert('Rol creado exitosamente');
                document.getElementById('create-role-form').reset();
                fetchRoles();  // Actualizar la lista de roles
            } else {
                alert(`Error al crear el rol`);
            }
        } catch (error) {
            console.error('Error al crear el rol:', error);
            alert(`Error al crear el rol. Datos tratando de enviar: ${JSON.stringify({ roleName, permissions })}`);
        }
    });
});

async function fetchRoles() {
    try {
        const response = await fetch('/postgres/read/getRoles');
        const data = await response.json();

        const rolesList = document.getElementById('roles-list');
        const roleSelect = document.getElementById('role');
        rolesList.innerHTML = '';
        roleSelect.innerHTML = '';

        data.fila.forEach(parametro => {
            const roleName = parametro.rolname;
            const listItem = document.createElement('li');
            listItem.textContent = roleName;
            rolesList.appendChild(listItem);
        });

        data.fila.forEach(parametro => {
            const nombreRol = parametro.rolname;
            const option = document.createElement('option');
            option.className = 'selector'
            option.value = nombreRol;
            option.textContent = nombreRol;
            roleSelect.appendChild(option);
        });

    } catch (error) {
        console.error('Error al obtener los roles:', error);
    }
}

async function fetchUsersWithRoles() {
    try {
        const response = await fetch('/postgres/read/getUsuariosConRoles');
        const data = await response.json();

        console.log('Data recibida:', data); // Agregamos este console.log para depurar

        if (Array.isArray(data) && data.length > 0) {
            const usersList = document.getElementById('users-list');
            usersList.innerHTML = '';

            // Creamos un elemento de lista para las columnas
            const columnHeader = document.createElement('li');
            columnHeader.textContent = 'Username - Rolname - Eliminar'; // Agregamos "Eliminar" aquí
            usersList.appendChild(columnHeader);

            // Iteramos sobre los datos y agregamos cada entrada a la lista
            data.forEach(user => {
                const username = user.username || 'No definido';
                const rolname = user.rolname || 'No definido';
                const listItem = document.createElement('li');
                const deleteButton = document.createElement('button'); // Creamos el botón de "Eliminar"
                deleteButton.className = 'botonbton'
                deleteButton.textContent = 'Eliminar'; // Texto del botón
                deleteButton.addEventListener('click', () => deleteUser(user.username)); // Agregamos un evento al botón
                listItem.textContent = `${username} - ${rolname} - `;
                listItem.appendChild(deleteButton); // Agregamos el botón al elemento de lista
                usersList.appendChild(listItem);
            });
        } else {
            console.error('Error al obtener los usuarios con roles: Los datos recibidos están vacíos o no son un array.');
        }
    } catch (error) {
        console.error('Error al obtener los usuarios con roles:', error);
    }
}



// Función para eliminar un usuario
// Función para eliminar un usuario
async function deleteUser(username) {
    try {
        // Mostrar un primer mensaje de confirmación
        const confirmFirst = window.confirm(`¿Estás seguro de que deseas eliminar al usuario ${username}?`);
        
        // Si el usuario confirma la eliminación en el primer mensaje
        if (confirmFirst) {
            // Mostrar un segundo mensaje de confirmación
            const confirmSecond = window.confirm('¿Estás realmente seguro?');

            // Si el usuario confirma la eliminación en el segundo mensaje
            if (confirmSecond) {
                const response = await fetch(`/postgres/delete/user/${username}`, {
                    method: 'DELETE'
                });

                const result = await response.json();
                if (result.success) {
                    // Vuelve a cargar la lista de usuarios después de eliminar
                    fetchUsersWithRoles();
                } else {
                    console.error('Error al eliminar el usuario:', result.error);
                }
            } else {
                console.log('Operación de eliminación cancelada (segundo mensaje)');
            }
        } else {
            console.log('Operación de eliminación cancelada (primer mensaje)');
        }
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
    }
}

document.getElementById('backup-button').addEventListener('click', async () => {
    try {
        const response = await fetch('/postgres/backup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        if (result.success) {
            // Crear un enlace de descarga
            const downloadLink = document.createElement('a');
            downloadLink.href = `/backups/${result.fileName}`; // Construir la URL correcta
            downloadLink.download = result.fileName; // Nombre del archivo de respaldo
            downloadLink.click();
        } else {
            console.error('Error al realizar el respaldo de la base de datos:', result.error);
        }
    } catch (error) {
        console.error('Error al realizar el respaldo de la base de datos:', error);
    }
});

document.getElementById('restore-button').addEventListener('click', async () => {
    try {
        const response = await fetch('/postgres/create/restore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        if (result.success) {
            alert('¡La restauración de la base de datos se ha realizado con éxito!');
        } else {
            alert('Error al restaurar la base de datos');
        }
    } catch (error) {
        console.error('Error al restaurar la base de datos:', error);
        alert('Error al restaurar la base de datos');
    }
});
