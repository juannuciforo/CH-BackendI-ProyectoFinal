import { Router } from "express";
import { cartModel }  from "../models/cart.model.js"
import { io } from "../server.js";
import { productModel } from "../models/product.model.js" // Agregamos esta importación
import mongoose from "mongoose";
export const cartsRoutes = Router();

// ------------------------------
// GET /carts/:cid
// ------------------------------
cartsRoutes.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({ error: "ID de carrito inválido" });
    }

    const cart = await cartModel.findById(cid).populate('products.product');
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

// ------------------------------
// POST /carts
// ------------------------------
cartsRoutes.post("/", async (req, res) => {
  try {
    const cart = await cartModel.create({ products: [] });
    res.status(201).json({
      message: "Carrito creado exitosamente",
      cart,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

// ------------------------------
// POST /api/carts/:cid/product/:pid - Agregar producto al carrito
// ------------------------------
cartsRoutes.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ error: "IDs inválidos" });
    }

    const cart = await cartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Buscar el índice del producto en el carrito
    const productIndex = cart.products.findIndex(
      item => item.product.equals(pid) // Usando equals de mongoose
    );

    if (productIndex !== -1) {
      // Si existe, incrementar la cantidad
      cart.products[productIndex].quantity += 1;
    } else {
      // Si no existe, agregarlo con cantidad 1
      cart.products.push({
        product: pid,
        quantity: 1
      });
    }

    await cart.save();
    
    res.status(200).json({
      message: "Producto agregado al carrito",
      cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});

// ------------------------------
// DELETE /carts/:cid/products/:pid
// ------------------------------
cartsRoutes.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ error: "IDs inválidos" });
    }

    const cart = await cartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    cart.products = cart.products.filter(item => !item.product.equals(pid));
    await cart.save();

    res.status(200).json({ message: "Producto eliminado del carrito", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el producto del carrito" });
  }
});

// ------------------------------
// PUT /api/carts/:cid/products/:pid - Actualizar cantidad de un producto
// ------------------------------
cartsRoutes.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ error: "IDs inválidos" });
    }

    // Primero encontramos el carrito
    const cart = await cartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Buscamos el índice del producto en el carrito
    const productIndex = cart.products.findIndex(
      item => item.product.equals(pid)
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: "Producto no encontrado en el carrito" });
    }

    // Actualizamos la cantidad
    cart.products[productIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({
      message: "Cantidad actualizada",
      cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la cantidad" });
  }
});

// ------------------------------
// DELETE /api/carts/:cid - Eliminar todos los productos del carrito
// ------------------------------
cartsRoutes.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({ error: "ID de carrito inválido" });
    }

    const cart = await cartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    cart.products = [];
    await cart.save();

    res.status(200).json({ message: "Carrito vaciado", cart });
  } catch (error) {
    res.status(500).json({ error: "Error al vaciar el carrito" });
  }
});