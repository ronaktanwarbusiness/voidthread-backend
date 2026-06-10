// cart/schemas/cart.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from './product.schema';
import { Variant } from './variant.schema';

export type CartDocument = HydratedDocument<Cart>;

class CartItem {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Product.name,
    required: true,
  })
  product_id: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Variant.name,
    required: true,
  })
  variant_id: mongoose.Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantity: number;
}

@Schema({ timestamps: true, collection: 'carts' })
export class Cart {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  })
  user_id: string;

  @Prop({ type: [CartItem], default: [] })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
