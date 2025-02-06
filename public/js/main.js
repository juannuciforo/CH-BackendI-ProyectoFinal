const socket = io();
const productsTable = document.querySelector('.responsive-table tbody');

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
    if (productsTable) {
        const tr = document.createElement('tr');
        tr.className = 'product-row';
        tr.id = `product-${product._id}`;
        tr.onclick = () => window.location.href = `/products/${product._id}`;
        tr.style.cursor = 'pointer';
        tr.innerHTML = `
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>${product.code}</td>
            <td>$${product.price}</td>
            <td>${product.stock}</td>
            <td>${product.category}</td>
        `;
        productsTable.appendChild(tr);
        
        Swal.fire({
            title: '¡Éxito!',
            text: `Producto agregado: ${product.title}`,
            icon: 'success',
            timer: 2000
        });
    } else {
        console.log('Tabla de productos no encontrada');
    }
});

socket.on('update-product', (product) => {
    if (productsTable) {
        const productRow = document.getElementById(`product-${product._id}`);
        if (productRow) {
            productRow.innerHTML = `
                <td>${product.title}</td>
                <td>${product.description}</td>
                <td>${product.code}</td>
                <td>$${product.price}</td>
                <td>${product.stock}</td>
                <td>${product.category}</td>
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
    const productRow = document.getElementById(`product-${productId}`);
    if (productRow) {
        productRow.remove();
        Swal.fire({
            title: '¡Eliminado!',
            text: 'El producto fue eliminado correctamente',
            icon: 'success',
            timer: 2000
        });
    } else {
        console.log('No se encontró el elemento con ID:', `product-${productId}`);
    }
});

socket.on('connect', () => {
    console.log('Conectado al servidor de WebSocket');
});

document.addEventListener('DOMContentLoaded', function() {
    M.AutoInit();
});