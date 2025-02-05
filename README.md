# Segunda Pre-entrega Backend

Servidor basado en Node.JS y express que implementa una API REST para manejar productos y carritos de compra, con vistas usando Handlebars y actualizaciones en tiempo real usando WebSocket.

## Instalación

```bash
npm install
```

## Uso

```bash
npm run dev
```

El servidor estará corriendo en http://localhost:8080

## Endpoints y Vistas

### Vistas
- GET / - Vista de productos (estática)
- GET /realtimeproducts - Vista de productos en tiempo real con WebSocket

### Products API
- GET /api/products
- GET /api/products/:pid
- POST /api/products
- PUT /api/products/:pid
- DELETE /api/products/:pid

### Carts API
- POST /api/carts
- GET /api/carts/:cid
- POST /api/carts/:cid/product/:pid

## Características
- Motor de plantillas Handlebars para las vistas
- WebSocket para actualizaciones en tiempo real
- Formulario de carga de productos en /realtimeproducts
- Actualización automática de la lista al crear o eliminar productos