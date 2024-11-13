const direccion = "192.168.100.11";
// Función para guardar el token en Local Storage
function guardarToken(token) {
    localStorage.setItem('token', token);
}

// Función para recuperar el token de Local Storage
function obtenerToken() {
    return localStorage.getItem('token');
}
function guardarId(id_cuenta) {
    localStorage.setItem('id_cuenta', id_cuenta);
}
function obtenerId() {
    return localStorage.getItem('id_cuenta');
}
// Función para verificar si el token ha expirado
function isTokenExpired(token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // La expiración del token está en segundos, convertir a milisegundos
    const currentTime = Date.now();
    return currentTime > exp;
}

// Lógica para verificar el token al cargar la página
document.addEventListener('DOMContentLoaded', (event) => {
    const token = obtenerToken();
    if (token && !isTokenExpired(token)) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const rol = payload.rol;
        mostrarContenidoPorRol(rol);
    } else {
        mostrarOpcionesInicioSesion();
        if (token) {
            // Eliminar el token expirado
            localStorage.removeItem('token');
            localStorage.removeItem("id_cuenta")
        }
    }
});

document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`http://${direccion}:5000/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, password })
        });

        if (!response.ok) {
            throw new Error('Error en la autenticación: ' + response.statusText);
        }

        const data = await response.json();
        const token = data.token;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const rol = payload.rol;

        //guardar id de usuario en localstage
        fetch(`http://${direccion}:5000/auth`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            }
        })
            .then(r => {
                if (!r.ok) {
                    throw new Error('Error en la solicitud: ' + r.statusText);
                }
                return r.json(); // Parsear la respuesta JSON
            })
            .then(d => {
                const c = d.find(i => i.nombre == nombre);
                if (c && token) {
                    console.log(c._id);
                    guardarId(c._id);
                } else {
                    console.log("Usuario no encontrado")
                }
            })
            .catch(error => {
                console.error("Error al obtener los datos:", error);
            });

        // Guardar el token en Local Storage
        guardarToken(token);

        alert('Inicio de sesión exitoso');
        mostrarContenidoPorRol(rol);
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Función para mostrar mensajes de admin o profesor y ocultar opciones de inicio de sesión
function mostrarContenidoPorRol(rol) {
    const loginForm = document.getElementById('login-form');
    const contenido = document.getElementById('contenido');
    const contenidoAdmin = document.getElementById('contenido-admin');
    const contenidoCuentas = document.getElementById('contenido-cuentas');
    const contenidoProyectos = document.getElementById('contenido-proyectos');
    const contenidoProfesor = document.getElementById('contenido-profesor');
    const eliminarCuentaPropia = document.getElementById('eliminar-cuenta-propia');
    const cerrarsesion = document.getElementById('cerrar-sesion');
    loginForm.style.display = 'none';
    contenido.style.display = 'block';
    cerrarsesion.style.display = 'block';
    if (rol === 'admin') {
        if (contenidoAdmin && contenidoCuentas && contenidoProyectos) {
            contenido.innerHTML = '';
            contenidoAdmin.style.display = 'flex';
            contenidoCuentas.style.display = 'block';
            contenidoProyectos.style.display = 'block';
            mostrarCuentas();
            mostrarProyectos();
        } else {
            console.error('Elementos contenido-admin, contenido-cuentas o contenido-proyectos no encontrados.');
        }
    } else if (rol === 'profesor') {
        if (contenidoProfesor) {
            contenido.innerHTML = ''
            contenidoProfesor.style.display = 'block';
            eliminarCuentaPropia.addEventListener('click', async () => {
                const response = await fetch(`http://${direccion}:5000/auth/${obtenerId()}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': obtenerToken()
                    }
                });
        
                if (!response.ok) {
                    throw new Error('Error al eliminar cuenta: ' + response.statusText);
                }
        
                alert('Cuenta eliminada exitosamente');
                localStorage.removeItem("id_cuenta");
                localStorage.removeItem('token');
                location.reload();
            });
            document.getElementById('editar-cuenta-propia').addEventListener('submit', async function (e) {
                e.preventDefault();
        
                const nombreEditado = document.getElementById('name-editado').value;
                const passwordEditado = document.getElementById('pswd-editado').value;
        
                const datosActualizados = {
                    nombre: nombreEditado,
                };
                if (passwordEditado) {
                    datosActualizados.password = passwordEditado;
                }
        
                try {
                    const response = await fetch(`http://${direccion}:5000/auth/${obtenerId()}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': obtenerToken()
                        },
                        body: JSON.stringify(datosActualizados)
                    });
        
                    if (!response.ok) {
                        throw new Error('Error al actualizar cuenta: ' + response.statusText);
                    }
        
                    alert('Cuenta actualizada exitosamente');
                    location.reload();
                } catch (error) {
                    alert('Error: ' + error.message);
                }
            });
        } else {
            console.error('Elementos contenido-profesor no encontrados.');
        }
    } else {
        contenido.innerHTML = '<h2>Rol no reconocido</h2>';
    }
}

// Función para mostrar opciones de inicio de sesión y ocultar mensajes
function mostrarOpcionesInicioSesion() {
    const loginForm = document.getElementById('login-form');
    const contenido = document.getElementById('contenido');
    const cerrarsesion = document.getElementById('cerrar-sesion')
    cerrarsesion.style.display = 'none';
    loginForm.style.display = 'block';
    contenido.style.display = 'none';
}

// Función para mostrar la lista de cuentas
async function mostrarCuentas() {
    try {
        const response = await fetch(`http://${direccion}:5000/auth`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': obtenerToken()
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener cuentas: ' + response.statusText);
        }

        const cuentas = await response.json();
        const listaCuentas = document.getElementById('lista-cuentas');
        listaCuentas.innerHTML = '';

        cuentas.forEach(cuenta => {
            const divCuenta = document.createElement('div');
            divCuenta.innerHTML = `
                <p>Nombre: ${cuenta.nombre} - Rol: ${cuenta.rol}</p>
                <button onclick="eliminarCuenta('${cuenta._id}')">Eliminar</button>
                <button onclick="mostrarFormularioEditar('${cuenta._id}', '${cuenta.nombre}', '${cuenta.rol}', this)">Editar</button>
            `;
            listaCuentas.appendChild(divCuenta);
        });
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Función para registrar una nueva cuenta
document.getElementById('registro-cuenta').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre-nuevo').value;
    const password = document.getElementById('password-nuevo').value;
    const rol = document.getElementById('rol-nuevo').value;

    try {
        const response = await fetch(`http://${direccion}:5000/auth/registro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': obtenerToken()
            },
            body: JSON.stringify({ nombre, password, rol })
        });

        if (!response.ok) {
            throw new Error('Error al registrar cuenta: ' + response.statusText);
        }

        alert('Cuenta registrada exitosamente');
        mostrarCuentas();
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Función para eliminar una cuenta
async function eliminarCuenta(id) {
    try {
        const response = await fetch(`http://${direccion}:5000/auth/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': obtenerToken()
            }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar cuenta: ' + response.statusText);
        }

        alert('Cuenta eliminada exitosamente');
        mostrarCuentas();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Función para mostrar el formulario de edición con los datos actuales
function mostrarFormularioEditar(id, nombre, rol, botonEditar) {
    cerrarFormularioEditar(); // Cierra cualquier formulario de edición abierto

    const divCuenta = botonEditar.parentElement;
    const formularioEdicion = document.createElement('div');
    formularioEdicion.id = 'formulario-edicion';
    formularioEdicion.innerHTML = `
        <h3>Editar Cuenta</h3>
        <form id="editar-cuenta">
            <label for="nombre-editado">Nombre:</label>
            <input type="text" id="nombre-editado" name="nombre-editado" value="${nombre}" required>
            <br>
            <label for="password-editado">Nueva Contraseña:</label>
            <input type="password" id="password-editado" name="password-editado">
            <br>
            <label for="rol-editado">Rol:</label>
            <select id="rol-editado" name="rol-editado" required>
                <option value="admin" ${rol === 'admin' ? 'selected' : ''}>Admin</option>
                <option value="profesor" ${rol === 'profesor' ? 'selected' : ''}>Profesor</option>
            </select>
            <br>
            <button type="submit">Actualizar</button>
            <button type="button" onclick="cerrarFormularioEditar()">Cancelar</button>
        </form>
    `;
    divCuenta.appendChild(formularioEdicion);

    // Evento para actualizar una cuenta
    document.getElementById('editar-cuenta').addEventListener('submit', async function (e) {
        e.preventDefault();

        const nombreEditado = document.getElementById('nombre-editado').value;
        const passwordEditado = document.getElementById('password-editado').value;
        const rolEditado = document.getElementById('rol-editado').value;

        const datosActualizados = {
            nombre: nombreEditado,
            rol: rolEditado
        };
        if (passwordEditado) {
            datosActualizados.password = passwordEditado;
        }

        try {
            const response = await fetch(`http://${direccion}:5000/auth/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': obtenerToken()
                },
                body: JSON.stringify(datosActualizados)
            });

            if (!response.ok) {
                throw new Error('Error al actualizar cuenta: ' + response.statusText);
            }

            alert('Cuenta actualizada exitosamente');
            cerrarFormularioEditar();
            mostrarCuentas();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
}

// Función para cerrar el formulario de edición
function cerrarFormularioEditar() {
    const formularioEdicion = document.getElementById('formulario-edicion');
    if (formularioEdicion) {
        formularioEdicion.remove();
    }
}

// Función para mostrar la lista de proyectos
async function mostrarProyectos() {
    try {
        const response = await fetch(`http://${direccion}:5000/proyectos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': obtenerToken()
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener proyectos: ' + response.statusText);
        }

        const proyectos = await response.json();
        const listaProyectos = document.getElementById('lista-proyectos');
        listaProyectos.innerHTML = '';

        proyectos.forEach(proyecto => {
            const divProyecto = document.createElement('div');
            divProyecto.innerHTML = `
                <p>Proyecto: ${proyecto.titulo}</p>
                <button onclick="eliminarProyecto('${proyecto._id}')">Eliminar</button>
                <button onclick="mostrarFormularioEditarProyecto('${proyecto._id}', this)">Editar</button>
            `;
            listaProyectos.appendChild(divProyecto);
        });
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Función para limpiar los comentarios de un JSON
function limpiarComentariosJSON(jsonString) {
    return jsonString.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');
}

// Función para registrar un nuevo proyecto (actualizada)
document.getElementById('registro-proyecto').addEventListener('submit', async function (e) {
    e.preventDefault();

    const archivos = document.getElementById('archivos').files;
    let archivoPDF = null;
    let archivoJSON = null;

    for (let archivo of archivos) {
        if (archivo.type === 'application/pdf') {
            archivoPDF = archivo;
        } else if (archivo.type === 'application/json') {
            archivoJSON = archivo;
        }
    }

    if (!archivoPDF || !archivoJSON) {
        alert('Debe subir un archivo PDF y un archivo JSON');
        return;
    }

    const formData = new FormData();
    formData.append('file', archivoPDF);

    try {
        const contenidoJSON = await archivoJSON.text();
        const contenidoJSONSinComentarios = limpiarComentariosJSON(contenidoJSON); // Limpiar comentarios
        const datosProyecto = JSON.parse(contenidoJSONSinComentarios);

        for (let key in datosProyecto) {
            formData.append(key, datosProyecto[key]);
        }

        const response = await fetch(`http://${direccion}:5000/proyectos`, {
            method: 'POST',
            headers: {
                'x-auth-token': obtenerToken()
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error al registrar proyecto: ' + response.statusText);
        }

        alert('Proyecto registrado exitosamente');
        //mostrarProyectos();
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Función para eliminar un proyecto
async function eliminarProyecto(id) {
    try {
        const response = await fetch(`http://${direccion}:5000/proyectos/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': obtenerToken()
            }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar proyecto: ' + response.statusText);
        }

        alert('Proyecto eliminado exitosamente');
        mostrarProyectos();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Función para mostrar el formulario de edición de proyecto
function mostrarFormularioEditarProyecto(id, botonEditar) {
    cerrarFormularioEditarProyecto(); // Cierra cualquier formulario de edición abierto

    const divProyecto = botonEditar.parentElement;
    const formularioEdicion = document.createElement('div');
    formularioEdicion.id = 'formulario-edicion-proyecto';
    formularioEdicion.innerHTML = `
        <h3>Editar Proyecto</h3>
        <form id="editar-proyecto">
            <label for="archivos-edit">Archivos:</label>
            <input type="file" id="archivos-edit" name="archivos-edit" multiple required>
            <br>
            <button type="submit">Actualizar</button>
            <button type="button" onclick="cerrarFormularioEditarProyecto()">Cancelar</button>
        </form>
    `;
    divProyecto.appendChild(formularioEdicion);

    // Evento para actualizar un proyecto
    document.getElementById('editar-proyecto').addEventListener('submit', async function (e) {
        e.preventDefault();

        const archivos = document.getElementById('archivos-edit').files;
        let archivoPDF = null;
        let archivoJSON = null;

        for (let archivo of archivos) {
            if (archivo.type === 'application/pdf') {
                archivoPDF = archivo;
            } else if (archivo.type === 'application/json') {
                archivoJSON = archivo;
            }
        }

        if (!archivoPDF || !archivoJSON) {
            alert('Debe subir un archivo PDF y un archivo JSON');
            return;
        }

        const formData = new FormData();
        formData.append('file', archivoPDF);

        try {
            const contenidoJSON = await archivoJSON.text();
            const datosProyecto = JSON.parse(contenidoJSON);

            for (let key in datosProyecto) {
                formData.append(key, datosProyecto[key]);
            }

            const response = await fetch(`http://${direccion}:5000/proyectos/${id}`, {
                method: 'PUT',
                headers: {
                    'x-auth-token': obtenerToken()
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error al actualizar proyecto: ' + response.statusText);
            }

            alert('Proyecto actualizado exitosamente');
            cerrarFormularioEditarProyecto();
            //mostrarProyectos();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
}

// Función para cerrar el formulario de edición de proyecto
function cerrarFormularioEditarProyecto() {
    const formularioEdicion = document.getElementById('formulario-edicion-proyecto');
    if (formularioEdicion) {
        formularioEdicion.remove();
    }
}


// Evento para cerrar sesión
document.getElementById('cerrar-sesion').addEventListener('click', function () {
    localStorage.removeItem('token');
    localStorage.removeItem("id_cuenta")
    location.reload();
});