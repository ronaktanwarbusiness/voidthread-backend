import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { CartModule } from '../cart/cart.module';
import { UserModule } from '../user/user.module';
import { OrderModule } from '../order/order.module';
import { AddressModule } from '../address/address.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Transaction,
  TransactionSchema,
} from 'src/database/schemas/transaction.schema';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [
    CartModule,
    UserModule,
    OrderModule,
    AddressModule,
    MongooseModule.forFeature([
      {
        name: Transaction.name,
        schema: TransactionSchema,
      },
    ]),
  ],
  providers: [PaymentService],
  controllers: [PaymentController, WebhookController],
  exports: [PaymentService],
})
export class PaymentModule {}
