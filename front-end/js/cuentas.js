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

        alert('Inicio de sesión exitoso');
        mostrarContenidoPorRol(rol);
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

function mostrarContenidoPorRol(rol) {
    const contenido = document.getElementById('contenido');
    contenido.style.display = 'block';

    if (rol === 'admin') {
        contenido.innerHTML = '<h2>Contenido para Admin</h2>';
    } else if (rol === 'profesor') {
        contenido.innerHTML = '<h2>Contenido para Profesor</h2>';
    } else {
        contenido.innerHTML = '<h2>Rol no reconocido</h2>';
    }
}
