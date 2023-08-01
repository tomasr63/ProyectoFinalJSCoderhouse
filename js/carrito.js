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
                    <img style="width: 13rem; height: 13rem" src="${producto.img}" class="card-img-carrito rounded-2" alt="${producto.nombre}">
                </div>
                <div class="w-100 text-center d-flex flex-column justify-content-evenly">
                    <h2 class="bg-dark align-self-center p-2 rounded-top" style="width: fit-content;">${producto.nombre}</h2>
                    <div class="info d-flex justify-content-around align-content-center">
                        <p class="m-0">Precio: $<span>${producto.importe}</span></p>
                        <p class="m-0">cantidad: <span>${producto.cantidad}</span></p>
                        <p class="m-0">Subtotal: $<span>${producto.cantidad * producto.importe}</span></p>
                        <button class="btn btn-eliminar btn-outline-secondary main-btns bg-dark" id="${producto.id}">Eliminar</button>
                    </div>
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

            Swal.fire({
                title: 'Cuidado',
                text: "Estas seguro que quieres eliminar este producto?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'green',
                cancelButtonColor: 'red',
                confirmButtonText: 'Si',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    productosEnLS.splice(indexEliminar, 1);
                    mostrarCarrito();
                    localStorage.setItem('carrito', JSON.stringify(productosEnLS));

                    if (!productosEnLS.length) {
                        return mostrarTitulo();
                    };
                };
            });
        });
    });
};

// Finalizar compra 
function finalizarCompra() {
    let btnFinalizarCompra = document.querySelector('#comprar');

    btnFinalizarCompra.addEventListener('click', () => {

        Swal.fire({
            title: 'Confirmar compra',
            text: "Se eliminaran todos los productos del carrito.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: 'green',
            cancelButtonColor: 'red',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then((res) => {
            if (res.isConfirmed) {

                localStorage.setItem('carrito', JSON.stringify([]));
                carritoContainer.innerHTML = "";
                mostrarTitulo();

                Swal.fire({
                    position: 'top',
                    icon: 'success',
                    title: 'Gracias por su compra',
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        })



        
       
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