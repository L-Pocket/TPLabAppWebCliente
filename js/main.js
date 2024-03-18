const divContenedor = document.querySelector("div#container")
const URL = "js/prendas.json"
const carrito = []

// Template Literal ${}
function crearCardHTML(producto) {
    return  `<div class="div-card">
            <div class="producto-imagen">${producto.imagen}<h1></h1></div>
            <div class="producto-nombre"><p>${producto.nombre}</p></div>
            <div class="producto-importe"><p>$ ${producto.importe}</p></div>
            <div class="producto-btnagregar"><button id="${producto.codigo}" class="btnagregar">AGREGAR</button></div>
            </div>`
}

function actualizarProdsEnCarrito() {
    const spanCarrito = document.querySelector('span#spanContadorCarrito')
    spanCarrito.textContent = carrito.length

}

function activarClickEnBotones() {
    const botonesAgregar = document.querySelectorAll('button.btnagregar')
    
    botonesAgregar.forEach((boton)=> {
        boton.addEventListener("click", ()=> {
            //alert('Hiciste click en el botón. Id: '+ boton.id)
            const productoSeleccionado = arrayProductos.find((producto) => producto.codigo === parseInt(boton.id))
            //console.log(productoSeleccionado)
            carrito.push(productoSeleccionado)
            //console.table(carrito)
            actualizarProdsEnCarrito()
        })
    })
}

function cargarProductos() {
    arrayProductos.forEach((producto) => divContenedor.innerHTML += crearCardHTML(producto))
    activarClickEnBotones()
}

fetch(URL)
.then((response) => response.json())
//.then((data) => console.table(data))
.then((data) => arrayProductos.push(...data))
.then(() => cargarProductos())

