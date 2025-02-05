import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnails: [String]
});

productSchema.plugin(mongoosePaginate); // Se agrega el plugin de paginacion

export const productModel = model("product", productSchema) // Se exporta el modelo de la coleccion