import { Controller, Post, Body, Get, Patch } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { EditProductDto } from './dtos/edit-product.dto';

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

  @Patch('product/edit')
  editProduct(@Body() body: EditProductDto) {
    return this.adminService.editProduct(body);
  }
}
