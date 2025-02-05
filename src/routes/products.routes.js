import { Router } from "express";
import { productModel }  from "../models/product.model.js"
import { io } from "../server.js";
import mongoose from "mongoose";
export const productsRoutes = Router();

// ------------------------------
// GET /products
// ------------------------------
productsRoutes.get("/", async (req, res) => {
  const { page = 1, limit = 10, category = "", status, sort } = req.query;

  try {
    // Construimos el filtro basado en category y/o status
    let filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (status !== undefined) {
      filter.status = status === "true"; // convierte el string a booleano
    }
    
    // Opciones de ordenamiento
    const options = {
      page: Number(page), 
      limit: Number(limit)
    };
    
    if (sort === "asc" || sort === "desc") {
      options.sort = { price: sort === "asc" ? 1 : -1 };
    }

    const products = await productModel.paginate(filter, options);
    
    if (!products.docs.length) {
      return res.status(404).json({ error: "No hay productos" });
    }
    
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// ------------------------------
// GET /products/:pid
// ------------------------------
productsRoutes.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    if (!pid || !mongoose.Types.ObjectId.isValid(pid)) return res.status(400).json({ error: "El ID debe ser válido" });

    const product = await productModel.findById(pid);
    res.status(200).json(product);
    
  } catch (error) {
    const status = error.status || 500;
    const message = status === 404 ? "No se encontró el producto" : "Error en el servidor";
    res.status(status).json({ error: message });
  }
});

// ------------------------------
// POST /products
// ------------------------------
productsRoutes.post("/", async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category)
      return res.status(400).json({ error: "Todos los campos son requeridos" });

    const product = await productModel.create({title, description, code, price, status:true, stock, category, thumbnails: thumbnails || []});

    // Emitir el evento de Socket.io para actualización en tiempo real
    io.sockets.emit("new-product", product);

    res.status(201).json({
      message: "Producto creado exitosamente",
      product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Ya existe un producto con ese código" });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Error al crear el producto" });
  }
});

// ------------------------------
// PUT /products/:pid
// ------------------------------
productsRoutes.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const nuevosDatos = req.body;

    if (!pid || !mongoose.Types.ObjectId.isValid(pid)) return res.status(400).json({ error: "El ID debe ser válido" });

    // Se busca el producto por ID y se actualiza con los nuevos datos (new: true para devolver el producto actualizado)
    const product = await productModel.findByIdAndUpdate(pid, nuevosDatos, { new: true });

    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    // Se emite el evento de Socket.io para actualización en tiempo real
    io.sockets.emit("update-product", product);

    res.status(200).json({
      message: "Producto actualizado exitosamente",
      product,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

// ------------------------------
// DELETE /products/:pid
// ------------------------------
productsRoutes.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    if (!pid || !mongoose.Types.ObjectId.isValid(pid)) return res.status(400).json({ error: "El ID debe ser válido" });

    // Se busca el producto por ID y se elimina
    const product = await productModel.findByIdAndDelete(pid);

    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    // Se emite el evento de Socket.io para actualización en tiempo real
    io.sockets.emit("delete-product", pid);
    
    res.status(200).json({
      message: "Producto eliminado exitosamente",
      product,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});