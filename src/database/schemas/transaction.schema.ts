import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type TransactionDocument = HydratedDocument<Transaction>;

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}
export enum PaymentGateway {
  CASHFREE = 'CASHFREE',
}

@Schema({
  timestamps: true,
  collection: 'transactions',
})
export class Transaction {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user_id: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  order_id: string;

  @Prop({
    trim: true,
    default: '',
  })
  pg_order_id: string;

  @Prop({
    trim: true,
    default: '',
  })
  pg_payment_id: string;

  @Prop({
    required: true,
    uppercase: true,
    trim: true,
    default: 'INR',
  })
  currency: string;

  @Prop({
    required: true,
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Prop({
    required: true,
    enum: PaymentGateway,
    default: PaymentGateway.CASHFREE,
  })
  payment_gateway: PaymentGateway;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    default: {},
  })
  snapshot: Record<string, any>;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
