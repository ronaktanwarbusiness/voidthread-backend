import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from 'src/database/schemas/order.schema';
import { TransactionDocument } from 'src/database/schemas/transaction.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async createOrder(transaction: TransactionDocument) {
    const order = await this.orderModel.create({
      user_id: transaction.user_id,
      transaction_id: transaction._id,
      order_id: transaction.order_id,
      snapshot: transaction.snapshot,
    });

    return order;
  }
}
