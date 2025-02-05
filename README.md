# Backend I - Proyecto Final

API REST desarrollada con Node.js y Express para gestión de productos y carritos de compra.

## Instalación y Uso

```bash
# Instalar dependencias
npm install

# Iniciar servidor en modo desarrollo
npm run dev
```

Servidor corriendo en http://localhost:8080

> Nota: La URI de conexión a MongoDB se provee a través de comentario en la entrega.

## Vistas
- `/` - Productos con paginación
- `/realtimeproducts` - Productos en tiempo real + formulario
- `/products/:pid` - Detalle de producto
- `/carts/:cid` - Vista de carrito

## Endpoints API

### Productos
- `GET /api/products` - Listar (query params: limit, page, sort, query)
- `GET /api/products/:pid` - Obtener uno
- `POST /api/products` - Crear
- `PUT /api/products/:pid` - Actualizar
- `DELETE /api/products/:pid` - Eliminar

### Carritos
- `POST /api/carts` - Crear carrito
- `GET /api/carts/:cid` - Ver carrito
- `POST /api/carts/:cid/product/:pid` - Agregar producto
- `PUT /api/carts/:cid/products/:pid` - Actualizar cantidad
- `DELETE /api/carts/:cid/products/:pid` - Quitar producto
- `DELETE /api/carts/:cid` - Vaciar carrito

> Nota: Se omitió el endpoint PUT /api/carts/:cid para actualizar carrito completo por indicación del profesor.

## Tecnologías
- Express.js y Node.js
- MongoDB/Mongoose
- Handlebars
- Socket.io
- Materialize CSS