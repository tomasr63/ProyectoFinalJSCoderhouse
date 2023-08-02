let productos = [];

fetch("./js/productos.json")
    .then(productos => productos.json())
    .then(data => {
        productos = data;
        mostrarTodos();
    });


// DOM
const btnShowAll = document.querySelector('#btn-show-all');
const buscarNombre = document.querySelector('#input-buscar');
let btnsAgregarAlCarrito = document.querySelectorAll('.agregar-al-carrito');
const numCarrito = document.querySelector('#num-carrito');
const btnsCat = document.querySelectorAll('.btn-cat');
const productosContainer = document.querySelector("#cards-container");
const btnPrecio = document.querySelector('#btn-precio');
const acordeones = document.querySelectorAll('.acordeon');


// MOSTRAR TODOS LOS PRODUCTOS
function mostrarTodos() {
    mostrarProductos(productos);
}

// Mostrar productos
function mostrarProductos(param1) {
    productosContainer.innerHTML = "";

    param1.forEach((producto) => {
        productosContainer.innerHTML += `
            <div class="card col mx-auto my-2 align-items-center" style="width: 18rem; max-height: 380px">
                <img style="width: 18rem; height: 15rem" src="${producto.img}" class="card-img-top" alt="${producto.nombre}">
                
                <div class="card-body">
                    <div class="d-flex flex-column justify-content-around align-items-center">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">$ ${producto.importe}</p>
                        <button class="btn agregar-al-carrito" id="${producto.id}">Agregar al carrito</button>
                    </div>
                </div>

            </div>`;
    });
    setBotonesAgregarCarrito();
};


// Botones agregar al carrito
function setBotonesAgregarCarrito() {
    btnsAgregarAlCarrito = document.querySelectorAll('.agregar-al-carrito');

    btnsAgregarAlCarrito.forEach((btn) => {
        btn.addEventListener('click', agregarAlCarrito);
    });
};

// CARRITO
let carrito;
let carritoLS = JSON.parse(localStorage.getItem('carrito'));

if (!carritoLS) {
    carrito = [];
} else {
    carrito = carritoLS;
    actualizarNumCarrito();
}

//Agregar al carrito
function agregarAlCarrito(e) {
    let productoAgregado = productos.find((producto) => producto.id === parseInt(e.currentTarget.id));

    if (carrito.some(producto => producto.id === parseInt(e.currentTarget.id))) {
        let index = carrito.findIndex(prod => prod.id === parseInt(e.currentTarget.id));
        carrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        carrito.push(productoAgregado);
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarNumCarrito();

    Toastify({
        text: "Producto agregado al carrito",
        duration: 3000,
        close: false,
        gravity: "top",
        position: "center",
        stopOnFocus: false,
        style: {
            background: "linear-gradient(to right, #00b09b, #24e1ac)",
        },
    }).showToast();
}

// Actualizar num Carrito
function actualizarNumCarrito() {
    let numeroDeProductos = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numCarrito.textContent = numeroDeProductos;
};

// Buscar productos por nombre
const buscarProductosXNombre = () => {
    let productoBuscado = buscarNombre.value.toLowerCase();

    if (productoBuscado === "") {
        productosContainer.innerHTML = "";
        return;
    }

    let productosEncontrados = productos.filter((producto) => producto.nombre.toLowerCase().includes(productoBuscado));

    // Si el Array de productos encontrados tiene elementos los muestra
    if (productosEncontrados.length > 0) {
        mostrarProductos(productosEncontrados);
    } else { // Sino se alerta que no hay coincidencias
        productosContainer.innerHTML = "";
        const h1 = document.createElement("h1");
        h1.textContent = "No se encontraron coincidencias...";
        h1.classList.add("titulo-404");
        productosContainer.appendChild(h1);
    }
};

// Filtrar por categorias
const filtrarPorCategorias = (e) => {
    let categoria = e.currentTarget.id.toLowerCase();
    let resultados = productos.filter((producto) => producto.categ.toLowerCase() === categoria);
    productosContainer.innerHTML = "";
    mostrarProductos(resultados);
};

// Buscar por precio
const buscarProductosXPrecio = (e) => {
    e.preventDefault();
    productosContainer.innerHTML = "";

    let precios = [];
    productos.forEach(prod => {
        precios.push(prod.importe);
    });

    let precioMin = parseInt(document.querySelector("#precio-min").value) || 0;
    let precioMax = parseInt(document.querySelector("#precio-max").value) || Math.max(...precios);

    let resultados = [];
    resultados = productos.filter(producto => {
        return producto.importe >= precioMin && producto.importe <= precioMax;
    });

    if (resultados.length > 0) {
        mostrarProductos(resultados);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se encontraron coincidencias.',
            confirmButtonText: 'Aceptar'
        });
    };
};

// EVENTOS
btnShowAll.addEventListener("click", mostrarTodos);
buscarNombre.addEventListener("input", buscarProductosXNombre);
btnsCat.forEach(btn => {
    btn.addEventListener('click', filtrarPorCategorias);
});
btnPrecio.addEventListener('click', buscarProductosXPrecio);
acordeones.forEach(btn => {
    btn.addEventListener('click', function () {
        this.classList.toggle('active');

        let panel = this.nextElementSibling;

        if (panel.style.display === 'block') {
            panel.style.display = 'none';
        } else {
            panel.style.display = 'block';
        }
    });
});