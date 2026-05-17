import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminUser, AdminUserSchema } from './schemas/admin-user.schema';
import { Product, ProductSchema } from './schemas/product.schema';
import { AdminService } from './admin.service';
import { ProductService } from './product.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdminUser.name, schema: AdminUserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService, ProductService],
  exports: [AdminService, ProductService, MongooseModule],
})
export class AdminModule {}
