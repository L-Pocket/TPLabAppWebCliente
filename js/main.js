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

function retornarError() {
    return  `<h2> No se encontraron productos... </h2>`
}

// CARRITO

function actualizarProdsEnCarrito() {
    const spanCarrito = document.querySelector('span#spanContadorCarrito')
    spanCarrito.textContent = carrito.length

    const btnCarrito = document.querySelector("#btn-carrito")
    const btnOcultarCarrito = document.querySelector("#ocultar-carrito")
    if (carrito.length > 0) {
        btnCarrito.style.display = "block"
    } else {
        btnCarrito.style.display = "none"
        btnOcultarCarrito.style.display = "none"
    }

    const carritoContainer = document.getElementById("container-carrito")
    carritoContainer.innerHTML = ""
    
    carrito.forEach((producto) => {
        carritoContainer.innerHTML += `<div class="carrito-item">
                                        <p>${producto.title} - $ ${producto.price}</p>
                                      </div>`
    })
}

const btnCarrito = document.querySelector("#btn-carrito")
const btnOcultarCarrito = document.querySelector("#ocultar-carrito");

function mostrarCarrito() {    
    const carritoContainer = document.getElementById("container-carrito")
    carritoContainer.innerHTML = ""

    if (carrito.length > 0) {
        carrito.forEach((producto) => {
            carritoContainer.innerHTML += `<div class="carrito-item">
                                            <p>${producto.title} - $ ${producto.price}</p>
                                          </div>`
        })
        carritoContainer.style.display = "block"
        btnOcultarCarrito.style.display = "block"
        btnCarrito.style.display = "none"
    } else {
        carritoContainer.innerHTML = "<p>No hay productos en el carrito.</p>"
        carritoContainer.style.display = "block"
        btnOcultarCarrito.style.display = "none"
        btnCarrito.style.display = "block"
    }
}
btnCarrito.addEventListener("click", mostrarCarrito)
btnOcultarCarrito.addEventListener("click", function() {
    const carritoContainer = document.getElementById("container-carrito")
    carritoContainer.style.display = "none"
    btnOcultarCarrito.style.display = "none"
})

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

// CARGAR PRODUCTOS

function cargarProductos(productos = arrayProductos) {
    if (productos.length > 0) {
        divContenedor.innerHTML = ""
        productos.forEach((producto) => divContenedor.innerHTML += crearCardHTML(producto))
        activarClickEnBotones()
    } else {
        divContenedor.innerHTML = retornarError()
    }
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


// ORDEN Y FILTRO BÚSQUEDA

const filtroBusqueda = document.getElementById("filtro-input")

function filtrarProductos() {
    const valorFiltro = filtroBusqueda.value.toLowerCase()

    const resultado = arrayProductos.filter((producto) => {
        return producto.title.toLowerCase().includes(valorFiltro)
    })

    cargarProductos(resultado)
}

filtroBusqueda.addEventListener("keyup", filtrarProductos)

function productosConIVA() {
    const productosConIVA = arrayProductos.map((producto)=> {
        return {
            ...producto,
            importeFinal: producto.price * 1.21
        }
    })
    console.table(productosConIVA)
}

function ordenarProductosPorPrecio(orden) {
    let productosOrdenados

    if (orden === "ascendente") {
        productosOrdenados = arrayProductos.sort((a, b) => a.price - b.price)
    }
    if (orden === "descendente") {
        productosOrdenados = arrayProductos.sort((a, b) => b.price - a.price)
    }
    divContenedor.innerHTML = ""
    cargarProductos(productosOrdenados)
}

const btnOrdenarBaratos = document.getElementById("btn-ordenar-baratos")
const btnOrdenarCaros = document.getElementById("btn-ordenar-caros")

btnOrdenarBaratos.addEventListener("click", () => ordenarProductosPorPrecio('ascendente'))
btnOrdenarCaros.addEventListener("click", () => ordenarProductosPorPrecio('descendente'))