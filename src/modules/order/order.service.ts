import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from 'src/database/schemas/order.schema';
import { TransactionDocument } from 'src/database/schemas/transaction.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async getOrders(user_id: string) {
    const orders = await this.orderModel.find({ user_id }).sort({ createdAt: -1 });
    return { isSuccess: true, data: orders };
  }

  async getOrderById(order_id: string, user_id: string) {
    const order = await this.orderModel.findOne({ _id: order_id, user_id });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return { isSuccess: true, data: order };
  }

  async createOrder(transaction: TransactionDocument) {
    const order = await this.orderModel.findOneAndUpdate(
      { transaction_id: transaction._id },
      {
        $setOnInsert: {
          user_id: transaction.user_id,
          transaction_id: transaction._id,
          order_id: transaction.order_id,
          snapshot: transaction.snapshot,
        },
      },
      { upsert: true, new: true },
    );

    return order;
  }
}
