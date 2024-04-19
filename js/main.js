const divContenedor = document.querySelector("div#container")
const URL = "https://fakestoreapi.com/products"
const carrito = []
const arrayProductos = []

function cargarCarrito() {
    const carritoLS = JSON.parse(localStorage.getItem('carrito')) || [];

    carritoLS.forEach(e => carrito.push(e))
    actualizarProdsEnCarrito()
}

// Template Literal ${}
function crearCardHTML(producto) {
    return  `<div class="div-card">
                <div ><image class="producto-imagen" src="${producto.image}" alt="Imagen de producto"></image></div>
                <div class="producto-nombre"><p>${producto.title}</p></div>
                <div class="producto-importe"><p>$ ${producto.price}</p></div>
                <div class="producto-btnagregar"><button id="${producto.id}" class="btnagregar">AGREGAR</button></div>
            </div>`
}

function retornarError() {
    return  `<h2> No se encontraron productos... </h2>`
}

// ALERTA CUSTOM

function abrirAlerta(mensaje = '¡Haz agregado un producto al carrito!') {
    document.getElementById('alerta').style.display = 'block'
    document.getElementById('mensaje-alerta').innerText = mensaje
    setTimeout(() => cerrarAlerta(), 1000)
}

function cerrarAlerta() {
    document.getElementById('alerta').style.display = 'none'
}

// CARRITO
const carritoContainer = document.getElementById("container-carrito")

function actualizarProdsEnCarrito() {
    const spanCarrito = document.querySelector('span#spanContadorCarrito')
    spanCarrito.textContent = carrito.length

    const btnCarrito = document.querySelector("#btn-carrito")
    const btnOcultarCarrito = document.querySelector("#ocultar-carrito")
    if (carrito.length > 0) {
        btnCarrito.style.display = "block"
        btnCarrito.disabled = false
    } else {
        btnCarrito.disabled = true
        // btnCarrito.style.display = "none"
        btnOcultarCarrito.style.display = "none"
    }

    // if (carritoContainer.style.display === 'block') {
    //     const btnCarrito = document.querySelector("#btn-carrito")
    //     // btnCarrito.style.display = "none"
    // }

    carritoContainer.innerHTML = ""
    
    carrito.forEach((producto) => {
        carritoContainer.innerHTML += `<div class="carrito-item">
                                        <p>${producto.title} - $ ${producto.price}</p>
                                      </div>`
    })

    persistirCarrito()
}

const btnCarrito = document.querySelector("#btn-carrito")
const btnOcultarCarrito = document.querySelector("#ocultar-carrito");
const btnVaciarCarrito = document.querySelector("#vaciar-carrito")
const allCarritoContainer = document.getElementById("container-all-carrito")

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
        allCarritoContainer.style.display = "block"
        btnOcultarCarrito.style.display = "block"
        // btnCarrito.style.display = "none"
        btnVaciarCarrito.style.display = 'block'
    } else {
        carritoContainer.innerHTML = "<p>No hay productos en el carrito.</p>"
        allCarritoContainer.style.display = "none"
        carritoContainer.style.display = "block"
        btnOcultarCarrito.style.display = "none"
        btnCarrito.style.display = "block"
        btnVaciarCarrito.style.display = 'none'
    }
}
btnCarrito.addEventListener("click", mostrarCarrito)
btnOcultarCarrito.addEventListener("click", function() {
    const carritoContainer = document.getElementById("container-carrito")
    carritoContainer.style.display = "none"
    allCarritoContainer.style.display = "none"
    btnOcultarCarrito.style.display = "none"
    btnCarrito.style.display = "block"
    btnVaciarCarrito.style.display = 'none'
})
btnVaciarCarrito.addEventListener("click", limpiarCarrito)

function activarClickEnBotones() {
    const botonesAgregar = document.querySelectorAll('button.btnagregar')
    
    botonesAgregar.forEach((boton)=> {
        boton.addEventListener("click", ()=> {
            //alert('Hiciste click en el botón. Id: '+ boton.id)
            const productoSeleccionado = arrayProductos.find((producto) => producto.id == boton.id)
            //console.log(productoSeleccionado)
            carrito.push(productoSeleccionado)
            abrirAlerta(`¡Haz agregado correctamente tu ${productoSeleccionado.title} al carrito!`)
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

function persistirCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito) || [])
}

const btnOrdenarBaratos = document.getElementById("btn-ordenar-baratos")
const btnOrdenarCaros = document.getElementById("btn-ordenar-caros")

btnOrdenarBaratos.addEventListener("click", () => ordenarProductosPorPrecio('ascendente'))
btnOrdenarCaros.addEventListener("click", () => ordenarProductosPorPrecio('descendente'))

cargarCarrito()

// Limpiar carrito y realizar compra

function limpiarCarrito() {
    carrito.length = 0
    actualizarProdsEnCarrito()
    btnVaciarCarrito.style.display = 'none'
    carritoContainer.style.display = 'none'
    allCarritoContainer.style.display = 'none'
    abrirAlerta("¡El carrito fue vaciado con exito!")
}

const btnRealizarCompra = document.getElementById('realizar-compra')

function realizarCompra() {
    carrito.length = 0
    actualizarProdsEnCarrito()
    btnVaciarCarrito.style.display = 'none'
    carritoContainer.style.display = 'none'
    allCarritoContainer.style.display = 'none'
    abrirAlerta("¡Compra realizada con exito!")
}
btnRealizarCompra.addEventListener('click', realizarCompra)

const btnInicio = document.getElementById('menu-inicio')
btnInicio.addEventListener('click', function(e) {
    e.preventDefault()
    window.location.href = ''
} )