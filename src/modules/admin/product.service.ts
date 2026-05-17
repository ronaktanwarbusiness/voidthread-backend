import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const slug = this.generateSlug(createProductDto.name);
    const existingProduct = await this.productModel.findOne({ slug });

    if (existingProduct) {
      throw new ConflictException('Product with this name/slug already exists');
    }

    const newProduct = new this.productModel({
      ...createProductDto,
      slug,
    });
    return newProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    let slugData = {};
    if (updateProductDto.name) {
      slugData = { slug: this.generateSlug(updateProductDto.name) };
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(
        id,
        { ...updateProductDto, ...slugData },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}
