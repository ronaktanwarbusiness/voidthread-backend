import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type AddressDocument = HydratedDocument<Address>;

@Schema({
  timestamps: true,
  collection: 'addresses',
})
export class Address {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user_id: string;

  @Prop({
    required: true,
    trim: true,
  })
  full_name: string;

  @Prop({
    required: true,
    trim: true,
  })
  phone: string;

  @Prop({
    required: true,
    trim: true,
  })
  address_line1: string;

  @Prop({
    trim: true,
    default: '',
  })
  address_line2: string;

  @Prop({
    trim: true,
    default: '',
  })
  landmark: string;

  @Prop({
    required: true,
    trim: true,
  })
  city: string;

  @Prop({
    required: true,
    trim: true,
  })
  state: string;

  @Prop({
    required: true,
    trim: true,
    default: 'India',
  })
  country: string;

  @Prop({
    required: true,
    trim: true,
  })
  pincode: string;

  @Prop({
    default: false,
  })
  is_default: boolean;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
