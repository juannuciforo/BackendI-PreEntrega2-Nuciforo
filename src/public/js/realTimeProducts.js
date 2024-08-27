const socket = io();

const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');

productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const product = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        stock: document.getElementById('stock').value
    };
    socket.emit('addProduct', product);
    productForm.reset();
});

productList.addEventListener('click', (e) => {
    if (e.target.classList.contains('deleteProduct')) {
        const productId = e.target.dataset.id;
        socket.emit('deleteProduct', productId);
    }
});

socket.on('updateProducts', (products) => {
    productList.innerHTML = products.map(product => `
        <li data-id="${product.id}">
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            <p>Precio: $${product.price}</p>
            <p>Stock: ${product.stock}</p>
            <button class="deleteProduct" data-id="${product.id}">Eliminar</button>
        </li>
    `).join('');
});