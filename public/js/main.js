const socket = io();
const productForm = document.getElementById('productForm');
const productsList = document.getElementById('products');

// Solo ejecutar el código del formulario si estamos en la página que lo contiene
if (window.location.pathname === '/realtimeproducts') {
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                code: document.getElementById('code').value,
                price: Number(document.getElementById('price').value),
                stock: Number(document.getElementById('stock').value),
                category: document.getElementById('category').value,
                thumbnails: []
            };

            try {
                const response = await fetch('/api/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    productForm.reset();
                } else {
                    throw new Error(data.error || 'Error al agregar el producto');
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    title: 'Error',
                    text: error.message,
                    icon: 'error'
                });
            }
        });
    }
}

socket.on('new-product', (product) => {
    if (productsList) {
        const li = document.createElement('li');
        li.className = 'collection-item';
        li.id = `product-${product._id}`;
        li.innerHTML = `
            <div>
                <strong>${product.title}</strong>: $${product.price}
            </div>
        `;
        productsList.appendChild(li);
        
        Swal.fire({
            title: '¡Éxito!',
            text: `Producto agregado: ${product.title}`,
            icon: 'success',
            timer: 2000
        });
    }
});

socket.on('update-product', (product) => {
    if (productsList) {
        const productElement = document.getElementById(`product-${product._id}`);
        if (productElement) {
            productElement.innerHTML = `
                <div>
                    <strong>${product.title}</strong>: $${product.price}
                </div>
            `;
        }
        Swal.fire({
            title: '¡Actualizado!',
            text: 'El producto fue actualizado correctamente',
            icon: 'success',
            timer: 2000
        });
    }
});

socket.on('delete-product', (productId) => {
    const productElement = document.getElementById(`product-${productId}`);
    if (productElement) {
        productElement.remove();
        Swal.fire({
            title: '¡Eliminado!',
            text: 'El producto fue eliminado correctamente',
            icon: 'success',
            timer: 2000
        });
    }
});

// Confirmar conexión de socket
socket.on('connect', () => {
    console.log('Conectado al servidor de WebSocket');
});

document.addEventListener('DOMContentLoaded', function() {
    M.AutoInit();
});