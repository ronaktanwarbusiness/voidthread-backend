import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class ProductImage {
  @Prop({ required: true, trim: true })
  url: string;

  @Prop({ trim: true })
  alt: string;
}

export const ProductImageSchema = SchemaFactory.createForClass(ProductImage);

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

  @Prop({ trim: true })
  description: string;

  @Prop({ required: true })
  original_price: number;

  @Prop({ required: true })
  selling_price: number;

  @Prop({ type: [ProductImageSchema], default: [] })
  images: ProductImage[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
