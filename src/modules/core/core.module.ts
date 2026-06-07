import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import {
  Collection,
  CollectionSchema,
} from 'src/database/schemas/collection.schema';
import { Product, ProductSchema } from 'src/database/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Collection.name, schema: CollectionSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [CoreController],
  providers: [CoreService],
})
export class CoreModule {}
