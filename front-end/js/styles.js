const btnHamburguesa = document.querySelector('.btn_hamburguesa');
const menuDesplegable = document.querySelector('.menu_desplegable');
const buscarBtn = document.querySelector('.buscar_btn');
const inputBuscar = document.querySelector('.input_buscar');

btnHamburguesa.addEventListener('click', () => {
    menuDesplegable.classList.toggle('active');
});

buscarBtn.addEventListener('click', () => {
    inputBuscar.classList.toggle('active');
});
