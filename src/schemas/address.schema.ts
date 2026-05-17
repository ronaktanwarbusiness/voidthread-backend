import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'addresses' })
export class Address extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'users' })
  user_id: Types.ObjectId;

  @Prop({ required: true, trim: true })
  full_name: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true, trim: true })
  address_line_1: string;

  @Prop({ trim: true })
  address_line_2: string;

  @Prop({ trim: true })
  landmark: string;

  @Prop({ required: true, trim: true })
  city: string;

  @Prop({ required: true, trim: true })
  state: string;

  @Prop({ required: true, trim: true })
  country: string;

  @Prop({ required: true, trim: true })
  pincode: string;

  @Prop({ default: false })
  is_default: boolean;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

export type AddressDocument = Address & Document;
