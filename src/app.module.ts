import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AddressModule } from './modules/address/address.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { CartModule } from './modules/cart/cart.module';
import { CategoryModule } from './modules/category/category.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentModule } from './modules/payment/payment.module';
import { UserModule } from './modules/user/user.module';
import { VariantModule } from './modules/variant/variant.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';

@Module({
  imports: [
    AddressModule,
    AdminModule,
    AuthModule,
    CartModule,
    CategoryModule,
    CouponModule,
    InventoryModule,
    OrderModule,
    PaymentModule,
    UserModule,
    VariantModule,
    WishlistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
