import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateProductDto } from './dtos/create-product.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('product/create')
  createProduct(@Body() body: CreateProductDto) {
    return this.adminService.createProduct(body);
  }
}
