import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/database/schemas/product.schema';
import { CreateProductDto } from './dtos/create-product.dto';
import { EditProductDto } from './dtos/edit-product.dto';

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

  async getProducts() {
    try {
      const products = await this.productModel.find().lean();
      return {
        message: 'Products retrieved successfully',
        data: products,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving products');
    }
  }

  async editProduct(dto: EditProductDto) {
    try {
      const { id, ...updateData } = dto;
      const updatedProduct = await this.productModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .lean();

      if (!updatedProduct) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      return {
        message: 'Product updated successfully',
        data: updatedProduct,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 11000) {
        throw new ConflictException('Product with this slug already exists');
      }
      throw new InternalServerErrorException('Error updating product');
    }
  }
}
