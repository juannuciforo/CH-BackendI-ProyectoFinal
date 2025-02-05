import { Router } from "express";
import { productModel } from "../models/product.model.js";
import mongoose from "mongoose";
import { cartModel } from "../models/cart.model.js";
export const viewsRoutes = Router();
import handlebars from "handlebars";

viewsRoutes.get("/", async (req, res) => {
    const { page = 1, limit = 10, category = "", status, sort } = req.query;
    
    try {
        // Se construye el filtro basado en category y/o status
        let filter = {};
        
        if (category) {
            filter.category = category;
        }
        
        if (status !== undefined) {
            filter.status = status === "true";
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
        
        res.render("home", { products });
    } catch (error) {
        console.error("Error loading products:", error);
        res.status(500).json({ message: "Error loading products" });
    }
});

viewsRoutes.get("/realtimeproducts", async (req, res) => {
    const { page = 1, limit = 10, category = "", status, sort } = req.query;
    
    try {
        // Se construye el filtro basado en category y/o status
        let filter = {};
        
        if (category) {
            filter.category = category;
        }
        
        if (status !== undefined) {
            filter.status = status === "true";
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
        
        res.render("realTimeProducts", { products });
    } catch (error) {
        console.error("Error cargando productos:", error);
        res.status(500).json({ message: "Error cargando productos" });
    }
});

viewsRoutes.get("/products/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).render("error", { message: "ID de producto inválido" });
        }
        
        const product = await productModel.findById(pid);
        
        if (!product) {
            return res.status(404).render("error", { message: "Producto no encontrado" });
        }
        
        res.render("productDetail", { product });
    } catch (error) {
        console.error("Error loading product:", error);
        res.status(500).render("error", { message: "Error cargando el producto" });
    }
});

viewsRoutes.get("/carts/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return res.status(400).render("error", { message: "ID de carrito inválido" });
        }

        const cart = await cartModel.findById(cid).populate('products.product');
        if (!cart) {
            return res.status(404).render("error", { message: "Carrito no encontrado" });
        }

        // Helpers para los cálculos
        const hbs = handlebars.create({
            helpers: {
                multiply: function(a, b) {
                    return (a * b).toFixed(2);
                },
                cartTotal: function(products) {
                    return products.reduce((total, item) => {
                        return total + (item.product.price * item.quantity);
                    }, 0).toFixed(2); // Se redondea a 2 decimales
                }
            }
        });

        res.render("cart", { cart });
    } catch (error) {
        console.error("Error loading cart:", error);
        res.status(500).render("error", { message: "Error cargando el carrito" });
    }
});