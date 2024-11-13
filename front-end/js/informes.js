const direccion = "192.168.100.11";
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('search');

    if (query) {
        fetch(`http://${direccion}:5000/proyectos?search=${query}`)
            .then(response => response.json())
            .then(proyectos => {
                const resultadosDiv = document.getElementById('right-section');
                resultadosDiv.innerHTML = '';
                proyectos.forEach(proyecto => {
                    const proyectoElement = document.createElement('div');
                    proyectoElement.innerHTML = `
                        <h3>${proyecto.titulo}</h3>
                        <p>${proyecto.resumen}</p>
                        <p>Autores: ${proyecto.autores.join(', ')}</p>
                        <p>Tutores: ${proyecto.tutores.join(', ')}</p>
                        <p>Categorías: ${proyecto.categorias.join(', ')}</p>
                        <a href="${proyecto.pdfUrl}" target="_blank">Ver más</a>
                    `;
                    resultadosDiv.appendChild(proyectoElement);
                });
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
                document.getElementById('right-section').innerHTML = 'Error al obtener los proyectos.';
            });
    } else {
        document.getElementById('right-section').innerHTML = 'No se proporcionó ningún término de búsqueda.';
    }
});
