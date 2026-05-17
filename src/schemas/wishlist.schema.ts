import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'wishlists' })
export class Wishlist extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'users' })
  user_id: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'products', default: [] })
  products: Types.ObjectId[];
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);

export type WishlistDocument = Wishlist & Document;
