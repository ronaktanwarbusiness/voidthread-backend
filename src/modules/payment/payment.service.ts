import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { CartService } from '../cart/cart.service';
import { Cashfree, CFEnvironment } from 'cashfree-pg';
import { UserService } from '../user/user.service';
import { OrderService } from '../order/order.service';
import { AddressService } from '../address/address.service';
import {
  BASE_URL,
  CASHFREE_CLIENT_ID,
  CASHFREE_CLIENT_SECRET,
  FRONTEND_URL,
} from 'src/config/env';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import {
  PaymentGateway,
  Transaction,
  TransactionDocument,
  TransactionStatus,
} from 'src/database/schemas/transaction.schema';
import { randomUUID } from 'crypto';

@Injectable()
export class PaymentService {
  private cashfree: Cashfree;
  constructor(
    private readonly cartService: CartService,
    private readonly userService: UserService,
    private readonly orderService: OrderService,
    private readonly addressService: AddressService,
    @InjectModel(Transaction.name)
    private readonly transaction_model: Model<TransactionDocument>,
  ) {
    this.cashfree = new Cashfree(
      CFEnvironment.SANDBOX,
      process.env.CASHFREE_CLIENT_ID!,
      process.env.CASHFREE_CLIENT_SECRET!,
    );
    console.log({ CASHFREE_CLIENT_ID });
  }

  async createPayment(body: CreatePaymentDto, user_id: string) {
    let transaction: TransactionDocument | null = null;

    if (!user_id) {
      return {
        is_success: false,
        error_code: 'UNAUTHENTICATED_USER',
      };
    }
    try {
      const cart = await this.cartService.getCart(user_id);

      const user = await this.userService.getUserById(user_id);

      const { data } = cart || {};

      const { items, price_breakup } = data || {};

      const { grand_total, tax_total } = price_breakup || {};

      if (!cart || !items || items.length === 0) {
        return {
          is_success: false,
          error_code: 'CART_EMPTY',
        };
      }

      const [billingAddress, shippingAddress] = await Promise.all([
        this.addressService.findAddressById(body.billing_address_id, user_id),
        this.addressService.findAddressById(body.shipping_address_id, user_id),
      ]);

      const order_id = `order_${randomUUID()}`;

      const request = {
        order_id,
        order_amount: grand_total,
        order_currency: 'INR',

        customer_details: {
          customer_id: user?._id?.toString() || 'guest_' + Date.now(),
          customer_name: user?.first_name || 'Guest User',
          customer_email: user?.email || 'guest@example.com',
          customer_phone: user?.phone || '9999999999',
        },

        order_meta: {
          return_url: FRONTEND_URL,
          notify_url: `${BASE_URL}/api/v1/webhook/cashfree`,
        },
      };

      const { data: cashfreeResponse } =
        await this.cashfree.PGCreateOrder(request);

      transaction = await this.transaction_model.create({
        user_id,
        order_id,
        currency: 'INR',
        status: TransactionStatus.PENDING,
        payment_gateway: PaymentGateway.CASHFREE,
        pg_order_id: cashfreeResponse?.cf_order_id || '',
        snapshot: {
          items,
          price_breakup,
          amount: grand_total,
          tax_amount: tax_total,
          billing_address: billingAddress?.toObject(),
          shipping_address: shippingAddress?.toObject(),
        },
      });

      return cashfreeResponse;
    } catch (err) {
      console.log('Error:', err?.message);

      return {
        is_success: false,
        error_code: 'INTERNAL_ERROR',
      };
    }
  }

  async handleCashfreeWebhook(body: any) {
    const { data } = body || {};
    const { order, payment } = data || {};
    const { order_id } = order || {};
    const { cf_payment_id, payment_status } = payment || {};

    const transaction = await this.transaction_model.findOne({
      order_id,
    });

    if (!transaction) {
      console.log('Transaction not found for order_id:', order_id);
      return;
    }

    transaction.pg_payment_id = cf_payment_id;
    transaction.status =
      payment_status === 'SUCCESS'
        ? TransactionStatus.SUCCESS
        : TransactionStatus.FAILED;

    await transaction.save();

    if (transaction.status === TransactionStatus.SUCCESS) {
      await this.orderService.createOrder(transaction);
    }
  }

  verifySignature(
    rawBody: string,
    signature: string,
    timestamp: string,
    clientSecret: string,
  ): boolean {
    const generatedSignature = crypto
      .createHmac('sha256', clientSecret)
      .update(timestamp + rawBody)
      .digest('base64');

    return generatedSignature === signature;
  }
}
