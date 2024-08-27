const socket = io();

const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');

productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const productData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: document.getElementById('price').value,
        stock: document.getElementById('stock').value,
    };
    console.log('Enviando datos de nuevo producto:', productData);
    socket.emit('addProduct', productData);
});

productList.addEventListener('click', (e) => {
    if (e.target.classList.contains('deleteProduct')) {
        const productId = e.target.dataset.id;
        console.log('Intentando eliminar producto con ID:', productId);
        socket.emit('deleteProduct', productId);
        // Se elimina el producto seleccionado y se arrojan los datos del mismo por consola
    }
});

socket.on('productAdded', (product) => {
    console.log('Producto agregado:', product);
    productForm.reset(); // Se limpia el formulario después de agregar un producto
});

socket.on('productDeleted', (deletedProduct) => {
    console.log('Producto eliminado:', deletedProduct);
    alert(`Producto "${deletedProduct.title}" eliminado exitosamente.`);
});

socket.on('productError', (errorMessage) => {
    console.error('Error en operación de producto:', errorMessage);
    alert(`Error: ${errorMessage}`);
});

socket.on('updateProducts', (products) => {
    console.log('Lista de productos actualizada:', products);
    updateProductList(products);
});

function updateProductList(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = products.map(product => `
        <li data-id="${product.id}">
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            <p>Código: ${product.code}</p>
            <p>Precio: $${product.price}</p>
            <p>Stock: ${product.stock}</p>
            <button class="deleteProduct" data-id="${product.id}">Eliminar</button>
        </li>
    `).join('');
}