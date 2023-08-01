import productos from "./productos.js";


// DOM
const btnShowAll = document.querySelector('#btn-show-all');
const buscarNombre = document.querySelector('#input-buscar');
const numCarrito = document.querySelector('#num-carrito');
const btnsCat = document.querySelectorAll('.btn-cat');
const productosContainer = document.querySelector("#cards-container");
const btnPrecio = document.querySelector('#btn-precio');
const acordeones = document.querySelectorAll('.acordeon');


// MOSTRAR TODOS LOS PRODUCTOS
const mostrarTodos = () => {
    mostrarProductos(productos);
}

// Mostrar productos
const mostrarProductos = (param1) => {
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

// CARRITO
let carrito;
let carritoLS = JSON.parse(localStorage.getItem('carrito'));

if (carritoLS) {
    carrito = carritoLS;
    actualizarNumCarrito();
} else {
    carrito = [];
}

// Botones agregar al carrito
const setBotonesAgregarCarrito = () => {
    let btnsAgregarAlCarrito = document.querySelectorAll('.agregar-al-carrito');

    btnsAgregarAlCarrito.forEach(btn => {
        btn.addEventListener('click', (e) => {
            let productoAgregado = productos.find((producto) => producto.id === parseInt(e.currentTarget.id));

            if (carrito.some(producto => producto.id === parseInt(e.currentTarget.id))) {
                productoAgregado.cantidad++;
            } else {
                productoAgregado.cantidad = 1;
                carrito.push(productoAgregado);
            }

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

            localStorage.setItem('carrito', JSON.stringify(carrito));
            
            actualizarNumCarrito();
        });
    });
};

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

// Ir arriba
// const irArriba = () => {
//     window.scrollTo({
//         top: 0,
//         behavior: 'smooth',
//     });
// };

// EVENTOS
btnShowAll.addEventListener("click", mostrarTodos);
buscarNombre.addEventListener("input", buscarProductosXNombre);
btnsCat.forEach(btn => {
    btn.addEventListener('click', filtrarPorCategorias);
});
btnPrecio.addEventListener('click', buscarProductosXPrecio);
acordeones.forEach(btn => {
    btn.addEventListener('click', function() {
        this.classList.toggle('active');

        let panel = this.nextElementSibling;

        if (panel.style.display === 'block') {
            panel.style.display = 'none';
        } else {
            panel.style.display = 'block';
        }
    });
});