import path from "path";
import morgan from "morgan";
import express from "express";
import { Server } from "socket.io";
import Handlebars from "handlebars";
import handlebars from "express-handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import mongoose from "mongoose";

import { __dirname } from "./dirname.js";
import { productsRoutes } from "./routes/products.routes.js";
import { cartsRoutes } from "./routes/carts.routes.js";
import { viewsRoutes } from "./routes/views.routes.js";
import { productModel } from "./models/product.model.js";

const app = express();
const PORT = 8080;

// Express config
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../public")));

// Handlebars config
// Configuración del motor (engine)
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
// Configurar el motor de plantillas en la aplicación
app.set("view engine", "hbs");
// Configuración de la carpeta de vistas
app.set("views", `${__dirname}/views`);

// Mongoose config
mongoose.connect("mongodb+srv://juannuciforo:PsG2r4XVVdqK5yDZ@codercluster.s98cf.mongodb.net/products?retryWrites=true&w=majority&appName=CoderCluster")
// URL de MongoDB Atlas proporcionada en comentarios de la entrega
.then(() => console.log("Conexión exitosa a la base de datos"))
.catch((err) => console.log("Error de conexión a la base de datos", err));

// Routes
app.use("/", viewsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);

// Listen config
const server = app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

export const io = new Server(server);

// Socket.io config
io.on("connection", async (socket) => {
  console.log("New client connected:", socket.id);
  
  const products = await productModel.find(); // Se obtienen los productos de la base de datos
  socket.emit("init", products);
});