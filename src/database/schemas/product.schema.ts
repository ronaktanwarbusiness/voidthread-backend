import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
  timestamps: true,
  collection: 'products',
})
export class Product {
  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  slug: string;

  @Prop({
    required: true,
    trim: true,
  })
  description: string;

  @Prop({
    required: true,
    min: 0,
  })
  original_price: number;

  @Prop({
    required: true,
    min: 0,
  })
  selling_price: number;

  @Prop({
    type: [String],
    default: [],
  })
  images: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
