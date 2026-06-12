import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Collection,
  CollectionDocument,
} from 'src/database/schemas/collection.schema';
import { Product, ProductDocument } from 'src/database/schemas/product.schema';
import { Variant, VariantDocument } from 'src/database/schemas/variant.schema';

@Injectable()
export class CoreService {
  constructor(
    @InjectModel(Collection.name)
    private collectionModel: Model<CollectionDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Variant.name) private variantModel: Model<VariantDocument>,
  ) {}

  async getProducts() {
    const products = await this.productModel.find().lean();

    return {
      message: 'Products retrieved successfully',
      data: products,
    };
  }

  async getVariantsByProductSlug(slug: string) {
    const product = await this.productModel.findOne({ slug }).lean();

    if (!product) {
      throw new NotFoundException(`Product with slug "${slug}" not found`);
    }

    const variantsWithIds = await this.variantModel
      .find({ product_id: product._id.toString() })
      // .populate('product_id')
      .lean();

    const variants = variantsWithIds.map((variant) => ({
      ...variant,
      id: variant._id.toString(),
      _id: undefined,
    }));

    return {
      message: 'Variants retrieved successfully',
      data: variants,
    };
  }

  async getCollectionProducts(slug: string) {
    const collection = await this.collectionModel
      .findOne({ slug, status: 'ACTIVE' })
      .populate('product_ids')
      .lean();

    if (!collection) {
      throw new NotFoundException(`Collection with slug "${slug}" not found`);
    }

    const products = collection.product_ids.map((product) => ({
      ...product,
      id: product._id.toString(),
      _id: undefined,
    }));

    return {
      message: 'Products retrieved successfully',
      data: products,
    };
  }
}
