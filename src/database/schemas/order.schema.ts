import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { Transaction } from './transaction.schema';

export type OrderDocument = HydratedDocument<Order>;

export enum OrderStatus {
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

@Schema({
  timestamps: true,
  collection: 'orders',
})
export class Order {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user_id!: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Transaction.name,
    required: true,
    unique: true,
  })
  transaction_id!: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  order_id!: string;

  @Prop({
    required: true,
    enum: OrderStatus,
    default: OrderStatus.CONFIRMED,
  })
  status!: OrderStatus;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    default: {},
  })
  snapshot!: Record<string, any>;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
