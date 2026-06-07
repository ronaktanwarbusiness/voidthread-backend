import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CollectionDocument = HydratedDocument<Collection>;

@Schema({
  timestamps: true,
  collection: 'collections',
})
export class Collection {
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
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    default: [],
  })
  product_ids: mongoose.Types.ObjectId[];

  @Prop({
    required: true,
    trim: true,
  })
  banner_img: string;

  @Prop({
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE',
    uppercase: true,
  })
  status: string;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
