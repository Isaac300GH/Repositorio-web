// Función para guardar el token en Local Storage
function guardarToken(token) {
    localStorage.setItem('token', token);
}

// Función para recuperar el token de Local Storage
function obtenerToken() {
    return localStorage.getItem('token');
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
        }
    }
});

document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/auth/login', {
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

    loginForm.style.display = 'none';
    contenido.style.display = 'block';

    if (rol === 'admin') {
        contenido.innerHTML = '<h2>Contenido para Admin</h2>';
    } else if (rol === 'profesor') {
        contenido.innerHTML = '<h2>Contenido para Profesor</h2>';
    } else {
        contenido.innerHTML = '<h2>Rol no reconocido</h2>';
    }
}

// Función para mostrar opciones de inicio de sesión y ocultar mensajes
function mostrarOpcionesInicioSesion() {
    const loginForm = document.getElementById('login-form');
    const contenido = document.getElementById('contenido');

    loginForm.style.display = 'block';
    contenido.style.display = 'none';
}
