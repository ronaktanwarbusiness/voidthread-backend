import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminUser } from './schemas/admin-user.schema';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(AdminUser.name)
    private readonly adminUserModel: Model<AdminUser>,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<AdminUser> {
    const { email } = createAdminDto;
    const existingAdmin = await this.adminUserModel.findOne({ email });

    if (existingAdmin) {
      throw new ConflictException('Admin user with this email already exists');
    }

    // Note: In a real app, password should be hashed here (e.g., using bcrypt)
    const newAdmin = new this.adminUserModel(createAdminDto);
    return newAdmin.save();
  }

  async findAll(): Promise<AdminUser[]> {
    return this.adminUserModel.find().exec();
  }

  async findOne(id: string): Promise<AdminUser> {
    const admin = await this.adminUserModel.findById(id).exec();
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return admin;
  }

  async delete(id: string): Promise<void> {
    const result = await this.adminUserModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
  }
}
