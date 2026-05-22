import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from './product.schema';

export type VariantDocument = HydratedDocument<Variant>;

@Schema({
  timestamps: true,
  collection: 'variants',
})
export class Variant {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Product.name,
    required: true,
  })
  product_id: string;

  @Prop({
    required: true,
    uppercase: true,
    trim: true,
    enum: ['S', 'M', 'L', 'XL', 'XXL'],
  })
  size: string;

  @Prop({
    required: true,
    trim: true,
  })
  color: string;

  @Prop({
    required: true,
    min: 0,
    default: 0,
  })
  stock: number;

  @Prop({
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  })
  sku: string;

  @Prop({
    type: [String],
    default: [],
  })
  images: string[];

  @Prop({
    enum: ['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'],
    default: 'ACTIVE',
  })
  status: string;
}

export const VariantSchema = SchemaFactory.createForClass(Variant);
