import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Collection,
  CollectionDocument,
} from 'src/database/schemas/collection.schema';
import { Product, ProductDocument } from 'src/database/schemas/product.schema';

@Injectable()
export class CoreService {
  constructor(
    @InjectModel(Collection.name)
    private collectionModel: Model<CollectionDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async getCollectionProducts(slug: string) {
    const collection = await this.collectionModel
      .findOne({ slug, status: 'ACTIVE' })
      .populate('product_ids')
      .lean();

    if (!collection) {
      throw new NotFoundException(`Collection with slug "${slug}" not found`);
    }

    return {
      message: 'Products retrieved successfully',
      data: collection.product_ids,
    };
  }
}
