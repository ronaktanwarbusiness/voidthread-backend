import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { CartModule } from '../cart/cart.module';
import { AddressModule } from '../address/address.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [CartModule, AddressModule, PaymentModule],
  providers: [CheckoutService],
  controllers: [CheckoutController],
})
export class CheckoutModule {}
