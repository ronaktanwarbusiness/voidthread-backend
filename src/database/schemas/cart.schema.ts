import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { Product } from './product.schema';
import { Variant } from './variant.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({
  timestamps: true,
  collection: 'carts',
})
export class Cart {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user_id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Product.name,
    required: true,
  })
  product_id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Variant.name,
    required: true,
  })
  variant_id: string;

  @Prop({
    required: true,
    min: 1,
    default: 1,
  })
  quantity: number;

  @Prop({
    required: true,
    min: 0,
  })
  price: number;

  @Prop({
    enum: ['ACTIVE', 'ORDERED', 'REMOVED'],
    default: 'ACTIVE',
  })
  status: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.index(
  {
    user_id: 1,
    variant_id: 1,
    status: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      status: 'ACTIVE',
    },
  },
);
