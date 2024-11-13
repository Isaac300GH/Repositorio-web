document.querySelector('.buscador').addEventListener('submit', function (event) {
    event.preventDefault();
    const query = document.getElementById('campoBusqueda').value;
    window.location.href = `html/informes.html?search=${query}`;
});
