import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/database/schemas/product.schema';
import { Variant, VariantSchema } from 'src/database/schemas/variant.schema';
import {
  Collection,
  CollectionSchema,
} from 'src/database/schemas/collection.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Variant.name, schema: VariantSchema },
      { name: Collection.name, schema: CollectionSchema },
    ]),
  ],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
