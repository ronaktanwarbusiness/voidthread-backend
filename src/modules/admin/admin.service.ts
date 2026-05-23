import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/database/schemas/product.schema';
import { CreateProductDto } from './dtos/create-product.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async createProduct(dto: CreateProductDto) {
    try {
      const newProduct = new this.productModel(dto);
      const savedProduct = await newProduct.save();

      return {
        message: 'Product created successfully',
        data: savedProduct,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Product with this slug already exists');
      }
      throw new InternalServerErrorException('Error creating product');
    }
  }
}
