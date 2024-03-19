const divContenedor = document.querySelector("div#container")
const URL = "https://fakestoreapi.com/products"
const carrito = []
const arrayProductos = []

// Template Literal ${}
function crearCardHTML(producto) {
    return  `<div class="div-card">
                <div class="producto-imagen"><image src="${producto.image}" alt="Imagen de producto"></image></div>
                <div class="producto-nombre"><p>${producto.title}</p></div>
                <div class="producto-importe"><p>$ ${producto.price}</p></div>
                <div class="producto-btnagregar"><button id="${producto.id}" class="btnagregar">AGREGAR</button></div>
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
            const productoSeleccionado = arrayProductos.find((producto) => producto.id === parseInt(boton.id))
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
.then((data) => {
    arrayProductos.push(...data)
    cargarProductos()
})
.catch((error) => {
    console.error('Error al obtener los productos:', error)
})

