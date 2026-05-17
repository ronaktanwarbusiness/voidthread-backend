import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum ProductSize {
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
}

export enum ProductColor {
  BLACK = 'BLACK',
  BROWN = 'BROWN',
  OFF_WHITE = 'OFF_WHITE',
  BEIGE = 'BEIGE',
}

@Schema({ timestamps: true, collection: 'variants' })
export class Variant extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  product_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, enum: ProductSize })
  size: string;

  @Prop({ required: true, enum: ProductColor })
  color: string;

  @Prop({ default: 0 })
  stock: number;
}

export const VariantSchema = SchemaFactory.createForClass(Variant);
