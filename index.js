
let arrayCarrito = [];
let productos = [];
const botonVaciar = document.getElementById('eliminar-carrito');
const precioTotal = document.getElementById('precio-total');


const containerCarrito = document.getElementById('carrito-container');




document.addEventListener('DOMContentLoaded', () => {
    createProduct();
    fetchData()
    aJson()
});


//crear una funcion
function aJson(){
  if(localStorage.getItem('cart')){
    arrayCarrito = JSON.parse(localStorage.getItem('cart'))
    renderizarCarrito()
  }
}

// traemos los productos con una promesa asyncrona.
async function fetchData(){
    const res = await fetch("./data.json");
    const data = await res.json();
    productos = data;
    console.log(productos)
    createProduct();
}





// creamos la funcion que renderiza nuestros productos traidos desde el json guardados en productos.
function createProduct(){
    const contenedorProductos = document.getElementById('container-productos');
        productos.forEach((producto) => {
        const div = document.createElement('div');
        div.innerHTML = `
        <div class="card">
        <img src="${producto.imagen}" class="card-img-top" alt="...">
        <div class="card-body">
        <h5 class="card-title">${producto.nombre}</h5>
        <p class="card-text">${producto.descripcion}</p>
        <p class="card-text">$ ${producto.precio}</p>
        <a class="agregar__carrito" id="button${producto.id}">Agregar al carrito</a>
      </div>
        </div>
        `
        contenedorProductos.appendChild(div)

        // agregamos funcionalidad al boton
        const agregar = document.getElementById(`button${producto.id}`);
        agregar.addEventListener('click',() => {
            alert(`Se agrego :  ${producto.nombre}`)
            pushearCarrito(`${producto.id}`);
            
        })
    })
}







// agregar producto al carrito
function pushearCarrito(id) {
    const producto = productos.find((p) => p.id == id);
    if (!producto) {
      return;
    }
    const existe = arrayCarrito.some((prod) => prod.id == id);
    if (existe) {
      arrayCarrito.map((prod) => {
        if (prod.id == id) {
          prod.cantidad++;
        }
      });
    } else {
      arrayCarrito.push({ ...producto, cantidad: 1 });
    }
    localStorage.setItem('cart',JSON.stringify(arrayCarrito))
    renderizarCarrito();
  }



// renderizamos el carrito
function renderizarCarrito(){
    containerCarrito.innerHTML = "";
     if(arrayCarrito.length < 1){
          return;}
     arrayCarrito.forEach(function renderizarProducto(producto){
         let productoContainer = document.createElement('div');
         productoContainer.id = producto.id
         productoContainer.innerHTML = `
         <div class="card">
         <h5 class="titulo">${producto.nombre}:</h5>
         <img src=${producto.imagen} alt=""/>
         <h4 class="price">$${producto.precio}</h4>
         <a class="cantidad">Cantidad:${producto.cantidad}</a>
         <a class="agregar__carrito agregar__carrito--2" id="eliminar${producto.id}">Retirar</a>
         </div>`
         containerCarrito.appendChild(productoContainer);
         const eliminar = document.getElementById(`eliminar${producto.id}`)
         eliminar.addEventListener('click', (id) => {
             eliminarDelCarrito(producto.id)
         })
         precioTotal.innerText = arrayCarrito.reduce((acc,producto) => acc + producto.cantidad * producto.precio, 0);
     })
 }




 function eliminarDelCarrito(id) {
  let existe = arrayCarrito.some((prod) => prod.id == id);
  if (existe) {
    arrayCarrito.map((prod) => {
      if (prod.id == id) {
        prod.cantidad--;
        if (prod.cantidad < 1) {
          arrayCarrito = arrayCarrito.filter((prod) => prod.id != id);
        }
      }
    });
  }
  precioTotal.textContent = arrayCarrito.reduce((acc, producto) => acc - producto.precio,0);
  localStorage.setItem('cart',JSON.stringify(arrayCarrito));
  renderizarCarrito();
}





botonVaciar.addEventListener('click', () => {
  alert('se vacio del carrito')
   arrayCarrito.length = 0;
   precioTotal.innerText = arrayCarrito.reduce((acc,producto) => acc - producto.precio, 0);
   localStorage.setItem('cart',JSON.stringify(arrayCarrito))
   renderizarCarrito();
 })