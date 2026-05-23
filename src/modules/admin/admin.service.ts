import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/database/schemas/product.schema';
import { Variant, VariantDocument } from 'src/database/schemas/variant.schema';
import {
  CreateProductDto,
  EditProductDto,
  CreateVariantDto,
  EditVariantDto,
} from './dtos';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Variant.name) private variantModel: Model<VariantDocument>,
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

  async getProductById(id: string) {
    try {
      const product = await this.productModel.findById(id).lean();

      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      return {
        message: 'Product retrieved successfully',
        data: product,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error retrieving product details');
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

  async createVariant(dto: CreateVariantDto) {
    try {
      const product = await this.productModel.findById(dto.product_id);
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${dto.product_id} not found`,
        );
      }

      const newVariant = new this.variantModel(dto);
      const savedVariant = await newVariant.save();

      return {
        message: 'Variant added successfully',
        data: savedVariant,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 11000) {
        throw new ConflictException('Variant with this SKU already exists');
      }
      throw new InternalServerErrorException('Error adding variant to product');
    }
  }

  async editVariant(dto: EditVariantDto) {
    try {
      const { id, ...updateData } = dto;

      if (updateData.product_id) {
        const product = await this.productModel.findById(updateData.product_id);
        if (!product) {
          throw new NotFoundException(
            `Product with ID ${updateData.product_id} not found`,
          );
        }
      }

      const updatedVariant = await this.variantModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .lean();

      if (!updatedVariant) {
        throw new NotFoundException(`Variant with ID ${id} not found`);
      }

      return {
        message: 'Variant updated successfully',
        data: updatedVariant,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 11000) {
        throw new ConflictException('Variant with this SKU already exists');
      }
      throw new InternalServerErrorException('Error updating variant');
    }
  }

  async getProductVariants(productId: string) {
    try {
      const variants = await this.variantModel
        .find({ product_id: productId })
        .lean();
      return {
        message: 'Product variants retrieved successfully',
        data: variants,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error retrieving product variants',
      );
    }
  }
}
