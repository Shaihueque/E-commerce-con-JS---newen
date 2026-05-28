let productos = [];
let seccionCards = document.getElementById("seccionCards");

/*Creamos una card*/
function crearCard(producto){
    
    let card = document.createElement("div");
    card.className = "card";

    let img = document.createElement("img");
    img.src = producto.img;
    img.alt = "Remera Oversize Color";
    img.className = "imgRemeraBlanca";

    let titulo = document.createElement("h3");
    titulo.innerText = producto.nombre.toUpperCase();

    let sexo = document.createElement("p");
    sexo.innerText = producto.sexo;

    let precio = document.createElement("p");
    precio.innerText = `$${producto.precio}`;

    let boton = document.createElement("btn");
    boton.innerText = `Agregar al carrito`;
    boton.className = " btn btnStyle";
    boton.onclick = () => agregarProducto(producto.id);

    card.appendChild(img);
    card.appendChild(titulo);
    card.appendChild(sexo);
    card.appendChild(precio);
    card.appendChild(boton);

    seccionCards.appendChild(card);
};

/*Pedimos datos a nuestro json*/
async function pedirProductos(busqueda = "") {
    try {
        let response = await fetch(`./data/data.json`);
        let data = await response.json();
        productos = data;

        // Filtrar productos
        let productosFiltrados = data.filter(producto =>
            producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
        );

        seccionCards.innerHTML = "";

        productosFiltrados.forEach(producto => {
            crearCard(producto);
        });

    } catch {
        console.log(error);
        document.getElementById("seccionCards").innerHTML = `<h3>Algo falló, revisá tu lógica</h3>`
    }
};

/*LLamamos nuestros datos pedidos en el json y pasamos esos datos para que se cree la card*/
pedirProductos();

/*Nuestro carrito vacio o con lo que quede guardado en el localstorage*/
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

/*Agregamos producto al carrito*/
function agregarProducto(id){
    let productoElegido = productos.find(el => el.id === id);

    if(productoElegido){
        if(carrito.some(el => el.id === productoElegido.id)){
            carrito = carrito.map(el => {
                if(el.id === productoElegido.id){
                    return {
                        ...el,
                        cantidad: el.cantidad + 1,
                    };
                }else{
                    return{
                        ...el
                    };
                };
            })
        }else{
            carrito.push({
                ...productoElegido, 
                cantidad: 1,
            });
        }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    //toastify - confirmacion de la operacion
    Toastify({
        text:`Agregaste correctamente ${productoElegido.nombre} a tu carrito`,
        duration: 2000,
        style:{
            blackground:"lenear-gradient(to right, #00b09b, #96c93d",
        }
    }).showToast();
    carritoProductos.innerHTML = "";
    carrito.forEach(el => crearCardCarrito(el));
    totalCarrito.innerText = `Total: $${calcularTotal()}`;
    }else{
        alert("valor no valido para agregar al carrito");
    }
};

/*Eliminar el producto*/
function eliminarProducto(id){
    let productoElegido = productos.find(el => el.id === id);
    if( carrito.some(el => el.id === id)){
        Swal.fire({
            title:"Eliminar producto",
            text: `Estas seguro de eliminar ${productoElegido.nombre}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#000000",
            cancelButtonColor: "rgb(117, 0, 0)",
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar",
        }).then ((result) =>{
            if(result.isConfirmed){
                carrito = carrito.filter(el => el.id !== id);
                localStorage.setItem("carrito", JSON.stringify(carrito));
                carritoProductos.innerHTML= "";
                carrito.forEach(el => crearCardCarrito(el));
                totalCarrito.innerText = `Total: $${calcularTotal()}`;
                Swal.fire({
                    title: "Listo!",
                    text: `Eliminaste correctamente ${productoElegido.nombre} de tu carrito`,
                    icon: "success"
                });
            };
        });
    };
};

/*Vaciamos el carrito por completo*/
function vaciarTodoElCarrito(){

    Swal.fire({
        title: "¿Vaciar carrito?",
        text: "Se eliminarán todos los productos del carrito",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#000",
        cancelButtonColor: "rgb(117, 0, 0)",
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar"

    }).then((result) => {

        if(result.isConfirmed){

            // Vaciar array
            carrito = [];

            // Vaciar localStorage
            localStorage.removeItem("carrito");

            // Limpiar carrito visualmente
            carritoProductos.innerHTML = "";

            // Mostrar mensaje carrito vacío
            carritoProductos.innerHTML = `
                <p class="carrito-vacio">
                    Tu carrito está vacío
                </p>
            `;
            /* si el carrito queda vacio el total vuelve a 0*/
            totalCarrito.innerText = `Total: $0`;

            // SweetAlert éxito
            Swal.fire({
                title: "Carrito vaciado",
                text: "Todos los productos fueron eliminados",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
};

/*Confirma la compra*/
function confirmarCompra(){

    // Verificar si el carrito está vacío
    if(carrito.length === 0){
        
        Swal.fire({
            title: "Tu carrito está vacío",
            text: "Agregá productos antes de confirmar la compra",
            icon: "info",
            confirmButtonColor: "#000"
        });

        return;
    }

    // Confirmación de compra
    Swal.fire({
        title: "¿Confirmar compra?",
        text: "Tu pedido será procesado",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#000",
        cancelButtonColor: "rgb(117, 0, 0)",
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar"

    }).then((result) => {

        if(result.isConfirmed){

            // Vaciar carrito
            carrito = [];

            // Limpiar localStorage
            localStorage.removeItem("carrito");

            // Limpiar HTML
            carritoProductos.innerHTML = `
                <p class="carrito-vacio">
                    Tu carrito está vacío
                </p>
            `;
            /*lo mismo, si el carrito se vacia vuelve a 0 pero esta vez porque se realizo la compra*/
            totalCarrito.innerText = `Total: $0`;

            // Mensaje final
            Swal.fire({
                title: "¡Compra realizada!",
                text: "Gracias por comprar en Tienda Newen ❤️",
                icon: "success",
                confirmButtonColor: "#000"
            });
        }
    });
};

/*Nos creo cada una de las card que va al carrito*/
function crearCardCarrito(producto){
    let card = document.createElement("div");
    card.className = "card cardCart";

    let img = document.createElement("img");
    img.src = producto.img;
    img.alt = "Remera Oversize Color";
    img.className = "imgRemeraBlanca";

    let titulo = document.createElement("h3");
    titulo.innerText = producto.nombre;

    let precio = document.createElement("p");
    precio.innerText = `$${producto.precio}`;

    let cantidad = document.createElement("p");
    cantidad.innerText = `${producto.cantidad} unidades`;

    let boton = document.createElement("btn");
    boton.innerText = `Eliminar del carrito`;
    boton.className = " btn btnDelete";
    boton.onclick = () => eliminarProducto(producto.id);

    card.appendChild(img);
    card.appendChild(titulo);
    card.appendChild(precio);
    card.appendChild(cantidad);
    card.appendChild(boton);
    
    carritoProductos.appendChild(card);
};

/*El total a pagar, se suma la unidad por precio de cada producto y se suma sucesivamente con los siguientes productos*/
function calcularTotal(){

    let total = carrito.reduce((acumulador, producto) => {

        return acumulador + (producto.precio * producto.cantidad);

    }, 0);

    return total;
};

let carritoCompras = document.getElementById("carritoCompras");
let carritoAside = document.getElementById("carrito");
let cerrarCarrito = document.getElementById("cerrarCarrito");
let carritoProductos = document.getElementById("carritoProductos");
let carritoConfirmarCompra = document.getElementById("carritoConfirmarCompra");

//Abrir carrito -Event
carritoCompras.addEventListener("click", () => {
    carritoAside.classList.add("abierto");
    carritoProductos.innerHTML = "";
    carrito.forEach(el => crearCardCarrito(el));
});
//Cerrar carrito -Event
cerrarCarrito.addEventListener("click", () => {
    carritoAside.classList.remove("abierto");
});

//Vaciar todo el carrito - EVENT-
vaciarCarrito.addEventListener("click", vaciarTodoElCarrito);
//Confirmar compra - Event
carritoConfirmarCompra.addEventListener("click", confirmarCompra);

let buscadorResponsiveSmall = document.getElementById("buscadorResponsiveSmall");

//Input-buscar palabra exacta
let btnBuscador = document.getElementById("btnBuscador");
btnBuscador.addEventListener("click", () =>{
    pedirProductos(buscadorResponsiveSmall.value);
    buscadorResponsiveSmall.value ="";
});

let burgerRemeras = document.getElementById("burgerRemeras");
let burgerBuzos = document.getElementById("burgerBuzos");
//Menu hamburgesa - evento de buzo y remera
burgerBuzos.addEventListener("click", () =>{
    pedirProductos("Buzo");
});
burgerRemeras.addEventListener("click", () =>{
    pedirProductos("Remera");
});

let totalCarrito = document.getElementById("totalCarrito");

let navRemeras = document.getElementById("navRemeras");
let navBuzos = document.getElementById("navBuzos");
let navTodos = document.getElementById("navTodos");
//Menu escritorio - evento de buzo y remera
navRemeras.addEventListener("click", () =>{
    pedirProductos("Remera");
});
navBuzos.addEventListener("click", () =>{
    pedirProductos("Buzo");
});
navTodos.addEventListener("click", () =>{
    pedirProductos();
});

//Buscador escritorio - palabras exactas
let buscadorInput = document.getElementById("buscadorInput");
let btnBuscadorEscritorio = document.getElementById("btnBuscadorEscritorio");
btnBuscadorEscritorio.addEventListener("click", () =>{
    pedirProductos(buscadorInput.value);
    buscadorResponsiveSmall.value ="";
});
