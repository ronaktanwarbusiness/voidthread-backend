import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/database/schemas/user.schema';
import { Product, ProductSchema } from 'src/database/schemas/product.schema';
import { Address, AddressSchema } from 'src/database/schemas/address.schema';
import { Cart, CartSchema } from 'src/database/schemas/cart.schema';
import { Variant, VariantSchema } from 'src/database/schemas/variant.schema';
import { Wishlist, WishlistSchema } from 'src/database/schemas/wishlist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Address.name,
        schema: AddressSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Variant.name,
        schema: VariantSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Wishlist.name,
        schema: WishlistSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Cart.name,
        schema: CartSchema,
      },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
