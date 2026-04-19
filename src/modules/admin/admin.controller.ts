import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminUser } from './schemas/admin-users.schema';

@ApiTags('Admin Management')
@Controller('admin-users')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new admin user' })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  @ApiResponse({ status: 409, description: 'Admin already exists' })
  async create(@Body() createAdminDto: CreateAdminDto): Promise<AdminUser> {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all admin users' })
  @ApiResponse({ status: 200, description: 'Return all admin users' })
  async findAll(): Promise<AdminUser[]> {
    return this.adminService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an admin user by ID' })
  @ApiResponse({ status: 200, description: 'Return the admin user' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  async findOne(@Param('id') id: string): Promise<AdminUser> {
    return this.adminService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an admin user' })
  @ApiResponse({ status: 200, description: 'Admin deleted successfully' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.adminService.delete(id);
  }
}
