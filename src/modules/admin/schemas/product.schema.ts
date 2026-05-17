import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ProductSize {
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
}

@Schema({ _id: false })
export class Variant {
  @Prop({ required: true, enum: ProductSize })
  size: string;

  @Prop({ required: true, trim: true })
  color: string;

  @Prop({ default: 0 })
  stock: number;
}

export const VariantSchema = SchemaFactory.createForClass(Variant);

@Schema({ timestamps: true, collection: 'products' })
export class Product extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  slug: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  selling_price: number;

  @Prop({ required: true })
  original_price: number;

  @Prop({
    enum: ['DRAFT', 'ACTIVE', 'ARCHIVED'],
    default: 'DRAFT',
  })
  status: string;

  @Prop([String])
  images: string[];

  @Prop({ type: [VariantSchema], default: [] })
  variants: Variant[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
