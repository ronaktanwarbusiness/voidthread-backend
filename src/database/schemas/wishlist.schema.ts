import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { Product } from './product.schema';

export type WishlistDocument = HydratedDocument<Wishlist>;

@Schema({
  timestamps: true,
  collection: 'wishlists',
})
export class Wishlist {
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
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
