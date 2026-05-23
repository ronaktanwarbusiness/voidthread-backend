import { Controller, Post, Body, Get, Patch, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  CreateProductDto,
  EditProductDto,
  CreateVariantDto,
  EditVariantDto,
} from './dtos';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('product/create')
  createProduct(@Body() body: CreateProductDto) {
    return this.adminService.createProduct(body);
  }

  @Get('product/list')
  getProducts() {
    return this.adminService.getProducts();
  }

  @Get('product/:id')
  getProductById(@Param('id') id: string) {
    return this.adminService.getProductById(id);
  }

  @Patch('product/edit')
  editProduct(@Body() body: EditProductDto) {
    return this.adminService.editProduct(body);
  }

  @Post('variant/create')
  addVariant(@Body() body: CreateVariantDto) {
    return this.adminService.createVariant(body);
  }

  @Patch('variant/edit')
  editVariant(@Body() body: EditVariantDto) {
    return this.adminService.editVariant(body);
  }

  @Get('product/:id/variants')
  getProductVariants(@Param('id') productId: string) {
    return this.adminService.getProductVariants(productId);
  }
}
