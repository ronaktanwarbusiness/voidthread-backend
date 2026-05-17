import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { ProductService } from './product.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminUser } from './schemas/admin-user.schema';
import { Product } from './schemas/product.schema';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@ApiTags('Admin Management')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly productService: ProductService,
  ) {}

  // Admin User Endpoints
  @Post('users')
  @ApiOperation({ summary: 'Create a new admin user' })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<AdminUser> {
    return this.adminService.create(createAdminDto);
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all admin users' })
  async findAllAdmins(): Promise<AdminUser[]> {
    return this.adminService.findAll();
  }

  // Product Management Endpoints
  @Post('product/create')
  @ApiOperation({ summary: 'Add a new product' })
  @ApiResponse({ status: 201, description: 'Product added successfully' })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Get('products')
  @ApiOperation({ summary: 'Get all products' })
  async findAllProducts(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Get product by ID' })
  async findOneProduct(@Param('id') id: string): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Patch('products/:id')
  @ApiOperation({ summary: 'Update product' })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Delete product' })
  async removeProduct(@Param('id') id: string): Promise<void> {
    return this.productService.remove(id);
  }
}
