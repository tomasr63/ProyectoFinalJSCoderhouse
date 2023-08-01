
// CONTENEDORES
let carritoContainer = document.querySelector('#carrito-container');

// LS
let productosEnLS = JSON.parse(localStorage.getItem('carrito'));

if (!productosEnLS || !productosEnLS.length) {
    mostrarTitulo();
} else {
    mostrarCarrito();
}

// Mostrar productos en carrito 
function mostrarCarrito() {
    carritoContainer.innerHTML = "";
    let total = 0;
    
    productosEnLS.forEach((producto) => {

        carritoContainer.innerHTML += `
        <div class="card mb-3 flex-row p-2" style="width: 100%;">
        <div class="img">
            <img style="width: 13rem; height: 13rem" src="${producto.img}" class="card-img-carrito" alt="">
        </div>
        <div class="info w-100 d-flex justify-content-around align-items-center">
            <p>Cantidad: ${producto.cantidad}<span></span></p>
            <p>Precio: $<span>${producto.importe}</span></p>
            <p>Subtotal: $<span>${producto.cantidad * producto.importe}</span></p>
            <button class="btn btn-eliminar btn-outline-secondary main-btns bg-dark" id="${producto.id}">Eliminar</button>
        </div>
        </div>`;

        total = productosEnLS.reduce((acc, producto) => acc + producto.cantidad * producto.importe, 0);

    });

    if (total === 0) {
        return;
    }

    const div = document.createElement('div');
    div.classList.add('container-fluid');
    div.innerHTML = `
        <div class="card mb-3 flex-row p-2 bg-dark" style="width: 100%;">
            <div class="info w-100 d-flex justify-content-around align-items-center">
                <button class="btn btn-success" id="comprar">Finalizar compra</button>
                <p class="text-white">Total: $<span>${total}</span></p>
            </div>
        </div>`;
    carritoContainer.append(div);

    setBotonesEliminar();
    finalizarCompra();
};

// Setear eventos en botones eliminar
function setBotonesEliminar() {
    let btnsEliminar = document.querySelectorAll('.btn-eliminar');

    btnsEliminar.forEach(btn => {
        btn.addEventListener('click', (e) => {
            let indexEliminar = productosEnLS.findIndex(producto => producto.id === parseInt(e.currentTarget.id));

            productosEnLS.splice(indexEliminar, 1);

            
            mostrarCarrito();
            localStorage.setItem('carrito', JSON.stringify(productosEnLS));
           
            if (!productosEnLS.length) {
                return mostrarTitulo();
            }
        });
    });
};

// Finalizar compra 
function finalizarCompra(){
    let btnFinalizarCompra = document.querySelector('#comprar');

    btnFinalizarCompra.addEventListener('click', () => {
        alert('se eliminaran todos los productos del carrito');
        localStorage.setItem('carrito', JSON.stringify([]));
        carritoContainer.innerHTML = "";
        alert('Gracias por comprar');
        mostrarTitulo();
    });
};

// Mostrar titulo
function mostrarTitulo() {
    const titulo = document.createElement('h1');
    titulo.textContent = "El carrito esta vacio.";
    titulo.classList.add('text-center');
    titulo.classList.add('text-white');
    const main = document.querySelector('#main-carrito');
    main.append(titulo);
}