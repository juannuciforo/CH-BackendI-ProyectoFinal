import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const cartSchema = new Schema({
    products: [
        {
        product: { 
            type: Schema.Types.ObjectId,
            ref: 'product',
            required: true 
        },
        quantity: { type: Number, required: true },
        },
    ],
});

cartSchema.plugin(mongoosePaginate);

// Middleware para popular automáticamente los productos
cartSchema.pre('findOne', function() {
    this.populate('products.product');
});

export const cartModel = model("carts", cartSchema);